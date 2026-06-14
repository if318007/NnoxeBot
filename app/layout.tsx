import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NNOXE Trading Community",
  description: "Trading Lebih Sedikit. Hasil Lebih Baik. Sistem trading kripto dengan efisiensi dan transparansi tinggi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${jakarta.className} min-h-screen antialiased selection:bg-blue-500/30`}>
        <div className="flex min-h-screen flex-col">
          <header className="fixed top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl shadow-sm">
            <div className="w-full mx-auto flex h-20 items-center justify-between px-6 md:px-12 max-w-[1400px]">
              <a href="#" className="flex items-center gap-2">
                <img src="/logo.png" alt="NNOXE Logo" className="h-14 md:h-16 object-contain" />
              </a>
              <nav className="hidden md:flex gap-8 text-sm font-semibold tracking-wide uppercase">
                <a href="/" className="text-slate-600 hover:text-blue-600 transition-colors">Beranda</a>
                <a href="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors">Dashboard</a>
                <a href="https://screener.orionterminal.com/" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-indigo-600 transition-colors">Terminal</a>
                <a href="/testimonials" className="text-slate-600 hover:text-blue-500 transition-colors">Testimoni</a>
              </nav>
              <a href="#join" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-all shadow-[0_4px_14px_0_rgb(0,82,255,0.39)] hover:shadow-[0_6px_20px_rgba(0,82,255,0.23)] hover:-translate-y-0.5">
                Gabung Sekarang
              </a>
            </div>
          </header>
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <footer className="border-t border-slate-200 bg-white/90 backdrop-blur-sm relative z-10 py-12">
            <div className="w-full mx-auto px-6 md:px-12 max-w-[1400px] text-center text-sm text-slate-500 font-medium">
              <p>&copy; {new Date().getFullYear()} NNOXE Trading Community. Hak Cipta Dilindungi.</p>
              <div className="mt-4 flex justify-center gap-4">
                <a href="/admin" className="hover:text-blue-600 transition-colors">Admin Panel</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
