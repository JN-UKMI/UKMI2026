import Image from "next/image";
import { ShieldAlert, Home } from "lucide-react";
import { auth, signOut } from "@/lib/auth";
import { TransitionLink } from "@/components/ui/TransitionLink";

export default async function ForbiddenPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/60 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-red-600 dark:text-red-400 uppercase">
            403 Forbidden
          </span>
          <h1 className="text-2xl font-black text-forest-900 dark:text-lime mt-1">
            Akses Ditolak
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
            Akun Google Anda <span className="font-semibold text-gray-900 dark:text-white">({session?.user?.email || "Pengguna"})</span> tidak terdaftar sebagai administrator JN UKMI.
          </p>
        </div>

        {session?.user && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 text-left">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "Avatar"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {session.user.name}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-2">
          {session?.user && (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                Keluar / Ganti Akun Google
              </button>
            </form>
          )}

          <TransitionLink
            href="/"
            className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
