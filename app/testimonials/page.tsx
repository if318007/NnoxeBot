"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays, subMonths } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MessageSquareQuote, CheckCircle2 } from "lucide-react";

type Testimonial = {
  id: string;
  discord_username: string;
  image_url: string;
  created_at: string;
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"terbaru" | "mingguan" | "bulanan">("terbaru");

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.log("Supabase Error:", error);
          setTestimonials([]);
        } else {
          setTestimonials(data || []);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter(t => {
    const date = new Date(t.created_at);
    if (filter === "mingguan") {
      return date >= subDays(new Date(), 7);
    }
    if (filter === "bulanan") {
      return date >= subMonths(new Date(), 1);
    }
    return true; // terbaru
  });

  return (
    <div className="w-full relative min-h-screen bg-slate-50">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-400/20 blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-6 md:px-12 pt-32 pb-20 max-w-[1400px] relative z-10">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center mx-auto mb-6 shadow-sm border border-blue-100">
            <MessageSquareQuote className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">Hasil <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Nyata</span> Komunitas</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Hasil nyata dari anggota komunitas NNOXE. Disinkronkan secara instan dari channel Discord `#member-results`.
          </p>
        </div>

      {/* Filters */}
      <div className="flex justify-center gap-3 mb-16">
        {(["terbaru", "mingguan", "bulanan"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full font-bold transition-all capitalize shadow-sm ${
              filter === f 
                ? "bg-blue-600 text-white shadow-blue-500/30" 
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Gallery */}
      {loading ? (
        <div className="text-center text-slate-500 py-12 font-medium">Memuat testimoni...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="text-center text-slate-500 py-12 font-medium">Belum ada testimoni di periode ini.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map(t => (
            <Card key={t.id} className="bg-white overflow-hidden border-slate-200 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-xl rounded-2xl group h-full flex flex-col">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                    {t.discord_username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-base block">{t.discord_username}</span>
                    <span className="text-xs font-bold text-blue-600 flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{format(new Date(t.created_at), "d MMM yyyy", { locale: localeId })}</span>
              </div>
              <CardContent className="p-0 relative flex-1 bg-slate-100 cursor-pointer" onClick={() => window.open(t.image_url, "_blank")}>
                <div className="w-full h-full min-h-[300px] flex items-center justify-center overflow-hidden">
                  <img 
                    src={t.image_url} 
                    alt="Profit Result" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
