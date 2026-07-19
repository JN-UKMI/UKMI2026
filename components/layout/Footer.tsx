import Image from "next/image";
import { ContactBlock } from "./ContactBlock";
import { MapEmbed } from "./MapEmbed";

export function Footer() {
  return (
    <footer className="bg-green-900 text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          <Image
            src="/logo-jnukmi.png"
            alt="JN UKMI Logo"
            width={60}
            height={60}
            className="h-16 w-auto"
          />
          <div>
            <h3 className="text-xl font-bold">JN UKMI</h3>
            <p className="text-green-200 text-sm">Jamaah Nurul Huda</p>
            <p className="text-green-200 text-sm">Unit Kegiatan Mahasiswa Islam</p>
          </div>
        </div>

        <div className="mb-8">
          <ContactBlock />
        </div>

        <div className="mb-8">
          <MapEmbed />
        </div>

        <div className="border-t border-green-700 pt-6 text-center text-sm text-green-300">
          &copy; {new Date().getFullYear()} JN UKMI. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
}
