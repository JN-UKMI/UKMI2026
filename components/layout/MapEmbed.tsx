import contactData from "@/content/kontak/main.json";

export function MapEmbed() {
  return (
    <div className="relative w-full h-36 md:h-44 rounded-lg overflow-hidden">
      <iframe
        src={contactData.map_embed_url}
        width="100%"
        height="100%"
        style={{ border: 0, position: "absolute", inset: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokasi UNS"
      />
    </div>
  );
}
