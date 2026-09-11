"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { QrCode, Upload, X, Download } from "lucide-react";

const HEX_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function QrGenerator() {
  const [qrText, setQrText] = useState("");
  const [qrFg, setQrFg] = useState("#1a4d2e");
  const [qrBg, setQrBg] = useState("#ffffff");
  const [qrFgText, setQrFgText] = useState(qrFg);
  const [qrBgText, setQrBgText] = useState(qrBg);
  const [qrSize, setQrSize] = useState(600);
  const [qrEcc, setQrEcc] = useState<"L" | "M" | "Q" | "H">("M");
  const [qrLogoPercent, setQrLogoPercent] = useState(22);
  const [qrLogoFile, setQrLogoFile] = useState<File | null>(null);
  const [qrLogoUrl, setQrLogoUrl] = useState<string | null>(null);
  const [qrDownloading, setQrDownloading] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  const qrPreviewUrl = qrText.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrText.trim())}&color=${qrFg.replace("#", "")}&bgcolor=${qrBg.replace("#", "")}&ecc=${qrLogoUrl ? "H" : qrEcc}&margin=1`
    : "";

  useEffect(() => {
    if (!qrLogoFile) {
      if (qrLogoUrl) URL.revokeObjectURL(qrLogoUrl);
      setQrLogoUrl(null);
      return;
    }
    const url = URL.createObjectURL(qrLogoFile);
    setQrLogoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [qrLogoFile]);

  const drawQrToCanvas = useCallback(async () => {
    const canvas = qrCanvasRef.current;
    if (!canvas || !qrPreviewUrl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = qrSize;
    canvas.width = size;
    canvas.height = size;
    const qrImg = new window.Image();
    qrImg.crossOrigin = "anonymous";
    qrImg.src = qrPreviewUrl;
    await new Promise<void>((resolve, reject) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => reject(new Error("QR load failed"));
    }).catch(() => {});
    if (!qrImg.complete || qrImg.naturalWidth === 0) return;
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(qrImg, 0, 0, size, size);
    if (qrLogoUrl) {
      const logoImg = new window.Image();
      logoImg.src = qrLogoUrl;
      await new Promise<void>((resolve) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => resolve();
      });
      if (logoImg.complete && logoImg.naturalWidth > 0) {
        const logoSize = size * (qrLogoPercent / 100);
        const pad = Math.max(6, logoSize * 0.12);
        const x = (size - logoSize) / 2;
        const y = (size - logoSize) / 2;
        const r = 12;
        ctx.fillStyle = qrBg;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, r);
        else ctx.rect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.save();
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, logoSize, logoSize, 8);
        else ctx.rect(x, y, logoSize, logoSize);
        ctx.clip();
        ctx.drawImage(logoImg, x, y, logoSize, logoSize);
        ctx.restore();
      }
    }
  }, [qrPreviewUrl, qrLogoUrl, qrBg, qrSize, qrLogoPercent]);

  useEffect(() => {
    drawQrToCanvas();
  }, [drawQrToCanvas]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-md border border-gray-100 dark:border-gray-800 space-y-6">
      <div>
        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <QrCode className="w-5 h-5 text-forest-600 dark:text-lime" />
          QR Code Generator
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mt-1">
          Custom warna + logo di tengah.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Teks / URL</label>
            <textarea
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
              placeholder="https://jnukmi.com/artikel/..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm focus:border-forest-600 focus:outline-none transition-colors font-medium text-gray-900 dark:text-white placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold">{qrText.length} karakter</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["jnukmi.com", "instagram.com/jnukmiuns"].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setQrText(preset)}
                className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-forest-50 dark:hover:bg-forest-950/40 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:text-forest-700 dark:hover:text-lime border border-gray-200 dark:border-gray-700 transition-colors cursor-pointer truncate max-w-full"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Warna QR</span>
              <span className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <input type="color" value={qrFg} onChange={(e) => { setQrFg(e.target.value); setQrFgText(e.target.value); }} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                <input
                  type="text"
                  value={qrFgText}
                  onChange={(e) => {
                    setQrFgText(e.target.value);
                    if (HEX_RE.test(e.target.value)) setQrFg(e.target.value);
                  }}
                  className="flex-1 min-w-0 text-xs font-mono text-gray-600 dark:text-gray-400 bg-transparent focus:outline-none"
                />
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Background</span>
              <span className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <input type="color" value={qrBg} onChange={(e) => { setQrBg(e.target.value); setQrBgText(e.target.value); }} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                <input
                  type="text"
                  value={qrBgText}
                  onChange={(e) => {
                    setQrBgText(e.target.value);
                    if (HEX_RE.test(e.target.value)) setQrBg(e.target.value);
                  }}
                  className="flex-1 min-w-0 text-xs font-mono text-gray-600 dark:text-gray-400 bg-transparent focus:outline-none"
                />
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Ukuran QR</span>
              <select value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white focus:border-forest-600 focus:outline-none cursor-pointer">
                <option value={400}>400 × 400</option>
                <option value={600}>600 × 600</option>
                <option value={800}>800 × 800</option>
                <option value={1000}>1000 × 1000</option>
                <option value={1200}>1200 × 1200</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Ukuran Logo {qrLogoUrl ? `(${qrLogoPercent}%)` : ""}</span>
              <span className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                <input type="range" min={12} max={32} value={qrLogoPercent} onChange={(e) => setQrLogoPercent(Number(e.target.value))} disabled={!qrLogoUrl} className="flex-1 accent-forest-600 disabled:opacity-30 cursor-pointer" />
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-9 text-right">{qrLogoPercent}%</span>
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Level Koreksi Error</span>
            <select
              value={qrLogoUrl ? "H" : qrEcc}
              disabled={!!qrLogoUrl}
              onChange={(e) => setQrEcc(e.target.value as "L" | "M" | "Q" | "H")}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-xs font-bold text-gray-900 dark:text-white focus:border-forest-600 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="L">L — 7% (QR paling pendek, cukup untuk area bersih)</option>
              <option value="M">M — 15% (standar)</option>
              <option value="Q">Q — 25% (tahan rusak sebagian)</option>
              <option value="H">H — 30% (paling tahan, wajib jika ada logo)</option>
            </select>
            {qrLogoUrl && (
              <p className="text-[10px] text-forest-600 dark:text-lime font-semibold">
                Logo aktif → ECC terkunci di H agar QR tetap bisa di-scan.
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Logo tengah (opsional)</span>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-xs font-bold text-gray-600 dark:text-gray-400 hover:border-forest-300 dark:hover:border-lime/40 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {qrLogoFile ? qrLogoFile.name.slice(0, 22) : "Upload PNG/JPG"}
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => setQrLogoFile(e.target.files?.[0] || null)} />
              </label>
              {qrLogoUrl && (
                <button type="button" onClick={() => setQrLogoFile(null)} className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 border border-red-200 dark:border-red-800 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Logo 15% aman, 22% default, &gt;28% berisiko susah scan.</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 bg-gray-50 dark:bg-gray-950 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
          {qrText.trim() ? (
            <>
              <div className="w-[260px] h-[260px] bg-white rounded-xl border border-gray-200 dark:border-gray-700 p-2 flex items-center justify-center overflow-hidden">
                <canvas ref={qrCanvasRef} width={600} height={600} className="w-[244px] h-[244px] object-contain" />
              </div>
              <button
                type="button"
                disabled={qrDownloading}
                onClick={async () => {
                  const canvas = qrCanvasRef.current;
                  if (!canvas) return;
                  setQrDownloading(true);
                  try {
                    await drawQrToCanvas();
                    const url = canvas.toDataURL("image/png");
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `qr-${Date.now()}.png`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  } finally {
                    setQrDownloading(false);
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-forest-600 hover:bg-forest-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                {qrDownloading ? "Menyiapkan..." : "Download PNG"}
              </button>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium text-center leading-relaxed">Preview & download {qrSize}×{qrSize} — logo {qrLogoUrl ? `${qrLogoPercent}% ECC H` : "tanpa logo ECC M"}</p>
            </>
          ) : (
            <div className="w-[260px] h-[260px] flex flex-col items-center justify-center gap-2 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
              <QrCode className="w-8 h-8" />
              <span className="text-xs font-bold">Masukkan teks dulu</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}