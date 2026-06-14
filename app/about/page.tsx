"use client";

import { Users, Target, Shield, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Tentang NNOXE</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Membangun komunitas trader yang memprioritaskan efisiensi, disiplin, dan pertumbuhan jangka panjang di atas spekulasi yang terburu-buru.
        </p>
      </div>

      <div className="prose prose-invert max-w-none prose-lg mb-20">
        <h2 className="text-3xl font-bold text-white mb-6">Misi Kami</h2>
        <p className="text-gray-300 leading-relaxed mb-8">
          NNOXE lahir dari rasa frustrasi terhadap lanskap trading kripto yang dipenuhi oleh pergerakan berbasis FOMO, *overtrading*, dan saluran "sinyal" yang menjanjikan kekayaan instan tanpa edukasi. Misi kami adalah mengubah persepsi tersebut dengan membuktikan bahwa Anda tidak perlu menatap grafik seharian untuk meraih kesuksesan. 
        </p>
        <p className="text-gray-300 leading-relaxed mb-8">
          Kami mengajarkan sistem penyaringan (menggunakan Orion Terminal dan alat canggih lainnya) untuk menemukan pengaturan probabilitas tinggi, mengeksekusinya tanpa emosi, dan melanjutkan hidup Anda.
        </p>

        <h2 className="text-3xl font-bold text-white mb-6 mt-16">Nilai Inti Kami</h2>
        <div className="grid md:grid-cols-2 gap-6 my-10 not-prose">
          {[
            {
              title: "Transparansi Penuh",
              desc: "Kami menampilkan grafik 'Sebelum' dan 'Sesudah' secara publik. Semua *win* dan *loss* kami bagikan.",
              icon: Shield,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
              border: "border-purple-500/20"
            },
            {
              title: "Kualitas &gt; Kuantitas",
              desc: "1 pengaturan (setup) A+ lebih berharga daripada 10 posisi (trade) C- yang biasa-biasa saja.",
              icon: Target,
              color: "text-cyan-400",
              bg: "bg-cyan-500/10",
              border: "border-cyan-500/20"
            },
            {
              title: "Edukasi di Atas Segala-galanya",
              desc: "Kami tidak hanya memberikan sinyal; kami menjelaskan ALASAN mengapa kami mengambil posisi tersebut.",
              icon: BookOpen,
              color: "text-yellow-400",
              bg: "bg-yellow-500/10",
              border: "border-yellow-500/20"
            },
            {
              title: "Dukungan Komunitas",
              desc: "Tumbuh bersama rekan-rekan trader dengan pemikiran yang sama dalam lingkungan tanpa drama.",
              icon: Users,
              color: "text-green-400",
              bg: "bg-green-500/10",
              border: "border-green-500/20"
            }
          ].map((item, i) => (
            <Card key={i} className={`glass ${item.border}`}>
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${item.bg} flex items-center justify-center mb-4`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
