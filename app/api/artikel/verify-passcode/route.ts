import { apiRateLimited, apiBadRequest, apiServiceUnavailable, apiOk, apiUnauthorized } from "@/lib/api-response";
import { checkRateLimit, recordFailedAttempt, clearAttempts, getClientIp, verifyPasscode, isPasscodeConfigured } from "@/lib/api-auth";
import { PasscodeOnlySchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const blocked = checkRateLimit(ip);
  if (blocked.blocked) {
    return apiRateLimited(
      `Terlalu banyak percobaan salah. Akses Anda diblokir sementara selama ${blocked.minutesLeft} menit.`,
      blocked.minutesLeft * 60
    );
  }

  if (!isPasscodeConfigured()) {
    return apiServiceUnavailable(
      "Kode akses pengurus belum dikonfigurasi oleh administrator server."
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return apiBadRequest("Body bukan JSON valid.");
  }

  const parsed = PasscodeOnlySchema.safeParse(raw);
  if (!parsed.success) return apiBadRequest("Format permintaan tidak valid.");

  if (!verifyPasscode(parsed.data.passcode)) {
    const after = recordFailedAttempt(ip);
    if (after.blocked) {
      return apiRateLimited(
        "Kode Akses salah 5 kali berturut-turut. Akses Anda diblokir sementara selama 15 menit.",
        15 * 60
      );
    }
    return apiUnauthorized(
      `Kode Akses Pengurus tidak valid. Sisa percobaan: ${5 - after.count}`,
      "AUTH_REQUIRED"
    );
  }

  clearAttempts(ip);
  return apiOk("Kode Akses terverifikasi.", { valid: true });
}
