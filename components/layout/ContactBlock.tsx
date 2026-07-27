import contactData from "@/content/kontak/main.json";

export function ContactBlock() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
      <div>
        <p className="font-semibold text-forest-600 mb-1">Email</p>
        <a href={`mailto:${contactData.email}`} className="text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-lime">
          {contactData.email}
        </a>
      </div>
      <div>
        <p className="font-semibold text-forest-600 mb-1">Telepon</p>
        <a href={`tel:${contactData.phone}`} className="text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-lime">
          {contactData.phone}
        </a>
      </div>
      <div>
        <p className="font-semibold text-forest-600 mb-1">Alamat</p>
        <p className="text-gray-600 dark:text-gray-300">{contactData.address}</p>
      </div>
    </div>
  );
}
