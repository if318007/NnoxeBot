"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldAlert, BarChart3, Clock, Zap, Target, Shield, MessageSquareQuote, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const [realTestimonials, setRealTestimonials] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) setRealTestimonials(data);
    }
    fetchTestimonials();
  }, []);

  const displayTestimonials = realTestimonials.length > 0 ? realTestimonials.map(t => ({
    id: t.id,
    name: t.discord_username,
    image: t.image_url,
    desc: "Profit Member NNOXE" 
  })) : [
    { id: 1, name: "RezaTrader99", image: "/testi-1.png", desc: "Profit 134.89% dalam satu setup" },
    { id: 2, name: "CryptoWhaleID", image: "/testi-2.png", desc: "Short berhasil +383.64%" },
    { id: 3, name: "NnoxeEnthusiast", image: "/testi-3.png", desc: "Liquidty tap and drop +191.13%" },
  ];

  return (
    <div className="flex flex-col items-center w-full bg-slate-50">
      
      {/* ================= HERO SECTION ================= */}
      <section id="hero" className="w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-4 relative pt-24 bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="w-full max-w-[1200px] z-10 relative">
          <div className="inline-block mb-8 px-5 py-2 rounded-full border border-blue-200 bg-blue-50 text-blue-700 font-bold text-xs tracking-widest uppercase shadow-sm">
            Platform Trading Generasi Baru
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-slate-900">
            TRADING LEBIH SEDIKIT.<br/>
            <span className="text-blue-600">HASIL LEBIH BAIK.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Berhenti mengambil posisi asal-asalan karena FOMO. Pelajari sistem trading kripto yang terstruktur, berfokus pada probabilitas tinggi, dan manajemen risiko presisi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a href="#join" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg px-8 py-7 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 border-none">
                Gabung Komunitas <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <Link href="/testimonials" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-lg px-8 py-7 bg-white shadow-sm transition-all">
                Lihat Hasil Member
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <a href="https://discord.gg/Mp3brkU9" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors flex items-center justify-center gap-2">
              Belum siap berlangganan? Gabung Grup Gratis <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </section>

      {/* ================= ABOUT / PROBLEM SECTION ================= */}
      <section id="about" className="w-full py-24 px-4 relative bg-slate-50 overflow-hidden">
        {/* Colorful Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-indigo-300/20 to-purple-300/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="w-full max-w-[1400px] mx-auto relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">Keluar dari Siklus <span className="text-blue-600">Kegagalan</span></h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Sebagian besar trader gagal karena terjebak dalam masalah psikologis yang sama. Saatnya mengubah pendekatan Anda menjadi lebih profesional.
            </p>
          </motion.div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Overtrading", desc: "Mengambil posisi berkualitas rendah hanya agar merasa 'aktif' di pasar.", icon: Zap, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
              { title: "FOMO Akut", desc: "Melompat masuk ke market yang sedang naik tajam tanpa rencana jelas.", icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
              { title: "Lelah Menatap Layar", desc: "Memantau grafik 1-menit seharian penuh tanpa sistem yang tervalidasi.", icon: Clock, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className={`h-full bg-white border ${item.border} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 rounded-2xl`}>
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                      <item.icon className={`h-7 w-7 ${item.color}`} />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* NNOXE Values */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="mt-32 pt-20 border-t border-slate-200">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 tracking-tight">Sistem NNOXE: <span className="text-blue-600">Kualitas &gt; Kuantitas</span></h3>
                <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                  NNOXE lahir dari kebutuhan akan transparansi dan edukasi nyata. Kami membantu Anda membangun sistem yang elegan dan terukur.
                </p>
                <ul className="space-y-5">
                  {[
                    "Transparansi Penuh (Before-After Publik)",
                    "Fokus pada Setup Probabilitas Tinggi (A+)",
                    "Edukasi Analisis & Manajemen Risiko",
                    "Komunitas Profesional Tanpa Toksisitas"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-lg">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <span className="text-slate-800 font-bold">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-blue-900/5 flex items-center justify-center overflow-hidden p-3 aspect-video">
                <img src="/system-mockup.png" alt="Sistem NNOXE" className="w-full h-full object-cover rounded-2xl relative z-10 hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ORION TERMINAL SECTION ================= */}
      <section id="orion" className="w-full py-24 px-4 bg-white border-y border-slate-200">
        <div className="w-full max-w-[1400px] mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative rounded-3xl bg-slate-50 border border-slate-200 shadow-xl flex items-center justify-center overflow-hidden p-3 aspect-square md:aspect-auto md:h-[500px]">
              <img src="/orion-mockup.png" alt="Orion Terminal" className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs tracking-widest uppercase">
                <Target className="w-4 h-4" /> Senjata Rahasia
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 text-slate-900 tracking-tight">Orion <span className="text-indigo-600">Screener</span></h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed font-medium">
                Penyaring pasar eksklusif yang memindai ribuan aset kripto secara real-time untuk menemukan anomali volume dan likuiditas sebelum pergerakan besar terjadi.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: "Deteksi Paus", desc: "Lacak pergerakan smart money" },
                  { title: "Sweep Liquidity", desc: "Sinyal zona manipulasi harga" },
                  { title: "Notifikasi Instan", desc: "Kirim langsung ke Discord" },
                  { title: "Filtrasi Presisi", desc: "Buang sinyal palsu" }
                ].map((ft, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-slate-900">{ft.title}</h4>
                    <p className="text-sm text-slate-600">{ft.desc}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-10">
                <a href="https://screener.orionterminal.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-1 group">
                  Buka Orion Screener
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= DASHBOARD PREVIEW ================= */}
      <section className="w-full py-24 px-4 bg-slate-50 relative overflow-hidden">
        {/* Colorful Mesh Gradients */}
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-300/20 to-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-blue-300/20 to-indigo-400/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">Transparansi <span className="text-blue-600">Penuh</span></h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Kami tidak menghapus trade yang gagal. Setiap setup didokumentasikan dengan jelas dari awal hingga akhir.
            </p>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}>
            <div className="relative flex flex-col md:flex-row items-center gap-6 bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 max-w-5xl mx-auto">
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4 self-start">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-slate-500 font-bold text-xs tracking-widest uppercase">Sebelum (Setup)</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner w-full max-h-[500px] flex items-center justify-center">
                  <img src="/before-1.png" alt="Setup Before" className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
              
              <div className="w-14 h-14 shrink-0 rounded-full bg-blue-600 flex items-center justify-center text-white z-10 shadow-lg shadow-blue-500/30 my-4 md:my-0">
                <ArrowRight className="h-6 w-6 md:rotate-0 rotate-90" />
              </div>

              <div className="w-full md:w-1/2 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4 self-start">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">Sesudah (Hasil)</span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner w-full max-h-[500px] flex items-center justify-center">
                  <img src="/after-1.png" alt="Setup After" className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            </div>
            <div className="text-center mt-12">
              <Link href="/dashboard">
                <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-10 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-105">
                  Buka Dashboard Rekapan Penuh
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section id="testimonials" className="w-full py-24 px-4 bg-white border-t border-slate-200">
        <div className="w-full max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-6">
              <MessageSquareQuote className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">Hasil <span className="text-blue-600">Nyata</span> Komunitas</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              Cuplikan profit yang dicetak oleh member NNOXE, disinkronkan secara otomatis dari Discord.
            </p>
          </div>

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayTestimonials.map((t, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="bg-white border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden h-full flex flex-col rounded-2xl">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 text-base block">{t.name}</span>
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0 relative flex-1 bg-slate-100">
                    <div className="w-full h-full overflow-hidden relative min-h-[250px]">
                      <img src={t.image} alt="Profit" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex items-end p-6">
                        <p className="text-white font-bold text-base leading-snug">"{t.desc}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-12">
            <Link href="/testimonials">
               <Button variant="outline" className="border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl px-10 py-6 text-lg shadow-sm transition-transform hover:scale-105">
                 Lihat Semua Testimoni Real-time
               </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= JOIN/PRICING SECTION ================= */}
      <section id="join" className="w-full py-32 px-4 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
        {/* Colorful Mesh Gradients */}
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[1400px] mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight flex items-center justify-center gap-3">
            NNOXE TRADES COMMUNITY
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto font-medium mb-16 italic">
            "Stop searching for the next signal. Learn how to understand the market."
          </p>

          <div className="mb-16">
            <span className="text-blue-700 font-bold bg-blue-100 inline-block px-6 py-3 rounded-full border border-blue-200 shadow-sm">
              Semua role mendapatkan akses yang sama. Perbedaannya hanya pada masa aktif membership.
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1400px] mx-auto mb-20">
            {[
              { title: "The Prospect", price: "Rp 150.000", duration: "1 Bulan", icon: "🌱", color: "bg-slate-900 hover:bg-slate-800", border: "border-slate-200 hover:border-slate-300" },
              { title: "The Student", price: "Rp 300.000", duration: "3 Bulan", icon: "🎓", color: "bg-slate-900 hover:bg-slate-800", border: "border-slate-200 hover:border-slate-300" },
              { title: "The Trader", price: "Rp 900.000", duration: "1 Tahun", icon: "📈", color: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30", recommended: true, border: "border-blue-500 shadow-xl" },
              { title: "The Analyst", price: "Rp 1.800.000", duration: "Lifetime", icon: "📊", color: "bg-slate-900 hover:bg-slate-800", border: "border-slate-200 hover:border-slate-300" }
            ].map((tier, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className={`bg-white relative flex flex-col h-full hover:-translate-y-2 transition-all duration-300 rounded-2xl border-2 ${tier.border} ${tier.recommended ? 'transform md:-translate-y-4' : ''}`}>
                  {tier.recommended && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full text-xs font-black tracking-widest shadow-md">DIREKOMENDASIKAN</div>
                  )}
                  <CardHeader className="text-center p-8 pb-4">
                    <div className="text-5xl mb-6">{tier.icon}</div>
                    <CardTitle className="text-xl font-bold text-slate-600">{tier.title}</CardTitle>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-black text-slate-900 block tracking-tight">{tier.price}</span>
                      <span className="text-slate-500 font-medium">/ {tier.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-8 pt-4">
                    <a href="https://discord.gg/a3465fmx" target="_blank" rel="noreferrer" className="w-full mt-auto">
                      <Button className={`w-full text-white font-bold rounded-xl py-6 text-md transition-colors ${tier.color}`}>
                        Pilih Paket
                      </Button>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left mb-16">
            <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm">
              <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-4 text-slate-900">
                <span className="text-3xl">💎</span> 
                Membership Includes
              </h3>
              <ul className="space-y-5">
                {[
                  "Daily Trading Signals",
                  "Signal Updates & Trade Management",
                  "Weekly Watchlist",
                  "Live Market Analysis",
                  "Live Education Sessions",
                  "Premium Educational Content",
                  "Member Discussion Access"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-bold text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-8">
              <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-sm flex-1">
                <h3 className="text-2xl font-extrabold mb-8 flex items-center gap-4 text-slate-900">
                  <span className="text-3xl">💳</span> 
                  Payment Methods
                </h3>
                <ul className="space-y-4 text-slate-700">
                  <li className="flex items-center gap-4 font-bold">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Bank Transfer
                  </li>
                  <li className="flex items-center gap-4 font-bold">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" /> E-Wallet (DANA, OVO, GoPay)
                  </li>
                  <li className="flex items-center gap-4 font-bold">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Cryptocurrency
                  </li>
                </ul>
              </div>

              <div className="bg-blue-600 rounded-3xl p-8 border border-blue-500 shadow-xl shadow-blue-600/20 text-center flex flex-col items-center justify-center">
                <p className="text-white mb-6 font-bold text-lg">
                  📩 For registration and payment, please contact Admin via DM.
                </p>
                <a href="https://discord.gg/a3465fmx" target="_blank" rel="noreferrer" className="w-full">
                  <Button className="w-full sm:w-auto bg-white hover:bg-slate-50 text-blue-700 font-extrabold rounded-xl px-10 py-6 text-lg shadow-md transition-transform hover:scale-105 border-none">
                    Hubungi Admin Sekarang
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto mb-10">
            <div className="bg-slate-900 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10 text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Belum Siap Berkomitmen?</h3>
                <p className="text-slate-400 font-medium">Bergabunglah dengan grup obrolan publik kami secara gratis dan pantau analisa harian NNOXE.</p>
              </div>
              <a href="https://discord.gg/Mp3brkU9" target="_blank" rel="noreferrer" className="w-full md:w-auto relative z-10">
                <Button size="lg" className="w-full md:w-auto bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-md px-8 py-6 transition-all border-none">
                  Masuk Grup Gratis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </motion.div>
          
        </div>
      </section>

    </div>
  );
}
