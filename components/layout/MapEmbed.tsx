import contactData from "@/content/contact.json";

export function MapEmbed() {
  return (
    <div className="relative w-full aspect-[16/7] rounded-lg overflow-hidden">
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
