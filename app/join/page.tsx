"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export default function Join() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Bergabung dengan NNOXE</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Pilih *role* Discord yang sesuai dengan tujuan trading Anda. Pembayaran akan ditangani secara aman.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
        {/* Observer */}
        <Card className="glass border-white/10 flex flex-col h-full hover:border-purple-500/50 transition-colors">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-300">Observer</CardTitle>
            <div className="mt-4">
              <span className="text-5xl font-extrabold">Rp 300.000</span>
              <span className="text-gray-400">/bulan</span>
            </div>
            <CardDescription className="text-gray-400 mt-2">Untuk trader paruh waktu yang hanya ingin mengikuti *setup* berkualitas tinggi dengan filter yang ketat.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Sinyal Real-time (Alerts)",
                "Akses rekapan mingguan",
                "Cocok untuk pekerja dengan jadwal sibuk",
                "Sudah termasuk level Entry / SL / TP",
                "Akses ke chat umum"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="text-gray-300">{f}</span>
                </li>
              ))}
            </ul>
            <a href="https://lynk.id/cryptoosinyal" target="_blank" rel="noreferrer" className="w-full mt-auto">
              <Button size="lg" className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                Pilih Observer
              </Button>
            </a>
          </CardContent>
        </Card>

        {/* Trader */}
        <Card className="glass border-cyan-500 relative shadow-[0_0_30px_rgba(6,182,212,0.15)] flex flex-col h-full transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-black px-4 py-1 rounded-full text-sm font-bold tracking-wider">DIREKOMENDASIKAN</div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-cyan-400">Trader</CardTitle>
            <div className="mt-4">
              <span className="text-5xl font-extrabold text-white">Rp 500.000</span>
              <span className="text-gray-400">/bulan</span>
            </div>
            <CardDescription className="text-gray-300 mt-2">Untuk mereka yang ingin MEMAHAMI sistem secara keseluruhan dan menjadi lebih mandiri.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ul className="space-y-4 mb-8 flex-1">
              <li className="font-bold text-white border-b border-white/10 pb-2 mb-2">Semua fitur Observer, ditambah:</li>
              {[
                "Analisis tren pasar harian",
                "Edukasi penyaringan volume",
                "Edukasi Analisis Teknikal (TA)",
                "Penjelasan detail alasan dari setiap *setup*",
                "Wawasan psikologi & kerangka berpikir (mindset)",
                "Akses channel diskusi prioritas"
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-gray-300">{f}</span>
                </li>
              ))}
            </ul>
            <a href="https://lynk.id/cryptoosinyal" target="_blank" rel="noreferrer" className="w-full mt-auto">
              <Button size="lg" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                Pilih Trader <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-2xl p-8 border border-white/10 text-center max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">Punya Pertanyaan Sebelum Bergabung?</h3>
        <p className="text-gray-300 mb-6">
          Bergabunglah dengan server Discord publik kami secara gratis untuk melihat-lihat komunitas terlebih dahulu sebelum mengambil keputusan.
        </p>
        <Link href="#">
          <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10 text-white">
            Masuk Discord Publik Secara Gratis
          </Button>
        </Link>
      </div>
    </div>
  );
}
