import { NextResponse } from "next/server";

// In-memory store for rate limiting brute force attempts
const failedAttempts = new Map<string, { count: number; blockedUntil: number }>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return "anonymous-ip";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const now = Date.now();

  // Rate Limiting Check
  const record = failedAttempts.get(ip);
  if (record && record.blockedUntil > now) {
    const minutesLeft = Math.ceil((record.blockedUntil - now) / 60000);
    return NextResponse.json(
      { message: `Terlalu banyak percobaan salah. Akses diblokir selama ${minutesLeft} menit.` },
      { status: 429 }
    );
  }

  try {
    const { passcode } = await request.json();

    if (!passcode) {
      return NextResponse.json({ message: "Kode Akses wajib diisi." }, { status: 400 });
    }

    const expectedPasscode = process.env.KODE_AKSES_PENGURUS || "UKMI2026";
    if (passcode !== expectedPasscode) {
      const newAttempts = (record?.count || 0) + 1;
      if (newAttempts >= 5) {
        failedAttempts.set(ip, { count: newAttempts, blockedUntil: now + 15 * 60 * 1000 });
        return NextResponse.json(
          { message: "Kode Akses salah 5 kali berturut-turut. Akses Anda diblokir sementara selama 15 menit." },
          { status: 429 }
        );
      } else {
        failedAttempts.set(ip, { count: newAttempts, blockedUntil: 0 });
        return NextResponse.json(
          { message: `Kode Akses Pengurus tidak valid. Sisa percobaan: ${5 - newAttempts}` },
          { status: 401 }
        );
      }
    }

    // Passcode correct, clear attempts
    failedAttempts.delete(ip);

    return NextResponse.json({ valid: true, message: "Kode Akses terverifikasi." });
  } catch (err: any) {
    return NextResponse.json({ message: "Gagal memverifikasi kode akses." }, { status: 500 });
  }
}
