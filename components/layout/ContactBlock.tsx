import contactData from "@/content/kontak/main.json";

export function ContactBlock() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
      <div>
        <p className="font-semibold text-forest-600 mb-1">Email</p>
        <a href={`mailto:${contactData.email}`} className="inline-flex text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-lime transition-all duration-200 motion-safe:hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 rounded-sm">
          {contactData.email}
        </a>
      </div>
      <div>
        <p className="font-semibold text-forest-600 mb-1">Telepon</p>
        <a href={`tel:${contactData.phone}`} className="inline-flex text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-lime transition-all duration-200 motion-safe:hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-600/40 dark:focus-visible:ring-lime/50 rounded-sm">
          {contactData.phone}
        </a>
      </div>
      <div>
        <p className="font-semibold text-forest-600 mb-1">Alamat</p>
        <p className="text-gray-600 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white">{contactData.address}</p>
      </div>
    </div>
  );
}
