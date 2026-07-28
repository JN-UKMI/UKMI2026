import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { TransitionLink } from "@/components/ui/TransitionLink";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const session = await auth();

  // If user is logged in & is admin, redirect directly to callbackUrl or /admin
  if (session?.user?.isAdmin) {
    redirect(params.callbackUrl || "/admin");
  }

  // If user is logged in but not admin, redirect to 403
  if (session?.user && !session.user.isAdmin) {
    redirect("/403");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 transition-colors relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-forest-600/10 dark:bg-lime/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 blur-3xl" />

      <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl relative z-10 text-center space-y-6">
        <div className="flex flex-col items-center">
          <Image
            src="/image/logo-jnukmi.svg"
            alt="JN UKMI Logo"
            width={72}
            height={72}
            className="w-16 h-auto mb-4"
          />
          <h1 className="text-2xl font-black text-forest-900 dark:text-lime">
            Admin Portal JN UKMI
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Silakan masuk dengan Akun Google terdaftar untuk mengelola konten dan berita website.
          </p>
        </div>

        {params.error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-2xl text-xs text-red-600 dark:text-red-400">
            Terjadi kesalahan autentikasi. Silakan coba lagi.
          </div>
        )}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: params.callbackUrl || "/admin" });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 text-gray-800 dark:text-gray-100 font-bold text-sm rounded-2xl border border-gray-300 dark:border-gray-700 shadow-xs transition-all hover:shadow-md cursor-pointer group"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Lanjutkan dengan Google
          </button>
        </form>

        <div className="pt-2 text-center">
          <TransitionLink
            href="/"
            className="text-xs font-semibold text-gray-500 hover:text-forest-600 dark:hover:text-lime transition-colors"
          >
            ← Kembali ke Beranda
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}
