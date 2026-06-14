"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { BarChart3, Image as ImageIcon, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";

type Recap = {
  id: string;
  date: string;
  result?: "win" | "lose" | "breakeven" | "pending";
  before_image_url: string;
  after_image_url?: string;
  created_at: string;
};

export default function Dashboard() {
  const [recaps, setRecaps] = useState<Recap[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Advanced Filters
  const [filterType, setFilterType] = useState<"all" | "this_week" | "this_month" | "custom">("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function fetchRecaps() {
      try {
        const { data, error } = await supabase
          .from("recaps")
          .select("*")
          .order("date", { ascending: false });

        if (error) throw error;
        setRecaps(data || []);
      } catch (error) {
        console.error("Error fetching recaps:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecaps();
  }, []);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyRecaps = recaps.filter(r => {
    const d = new Date(r.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;

  const filteredRecaps = recaps.filter(r => {
    const d = new Date(r.date);
    const now = new Date();
    
    if (filterType === "all") return true;
    
    if (filterType === "this_month") {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    
    if (filterType === "this_week") {
      const day = now.getDay() === 0 ? 7 : now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - day + 1);
      startOfWeek.setHours(0,0,0,0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23,59,59,999);
      
      return d >= startOfWeek && d <= endOfWeek;
    }
    
    if (filterType === "custom") {
      if (!startDate || !endDate) return true;
      const s = new Date(startDate);
      s.setHours(0,0,0,0);
      const e = new Date(endDate);
      e.setHours(23,59,59,999);
      return d >= s && d <= e;
    }
    
    return true;
  });

  const wins = filteredRecaps.filter(r => r.result === "win").length;
  const loses = filteredRecaps.filter(r => r.result === "lose").length;
  const breakevens = filteredRecaps.filter(r => r.result === "breakeven").length;
  const totalResolved = wins + loses + breakevens;
  const winrate = totalResolved > 0 ? Math.round((wins / totalResolved) * 100) : 0;
  
  const totalTrades = filteredRecaps.length; 

  return (
    <div className="w-full relative min-h-screen bg-slate-50">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] rounded-full bg-blue-300/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-300/20 blur-[120px]" />
      </div>

      <div className="w-full mx-auto px-6 md:px-12 pt-32 pb-20 max-w-[1400px] relative z-10">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-900">Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Rekapan Publik</span></h1>
          <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">Transparansi total. Pantau setiap perencanaan awal (setup) dan lihat bagaimana pasar merespons (hasil).</p>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Trading</CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{loading ? "-" : totalTrades}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/3" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Tingkat Kemenangan</CardTitle>
            <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">W</span>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-4xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
              {loading ? "-" : winrate}<span className="text-2xl text-slate-400">%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-slate-200 hover:shadow-md transition-all rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Trade Profit</CardTitle>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-slate-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-900 tracking-tight">{loading ? "-" : wins}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm gap-4">
        <h2 className="text-xl font-bold text-slate-900 flex-shrink-0">Linimasa Trading</h2>
        
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4 items-start sm:items-center">
          <select 
            className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 font-bold outline-none cursor-pointer min-w-[200px]"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
          >
            <option value="all">Semua Waktu</option>
            <option value="this_week">Minggu Ini</option>
            <option value="this_month">Bulan Ini</option>
            <option value="custom">Pilih Tanggal Kustom...</option>
          </select>

          {filterType === "custom" && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Dari</span>
                <Input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-800 rounded-xl"
                />
              </div>
              <span className="text-slate-400 font-bold mt-5">-</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Sampai</span>
                <Input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-800 rounded-xl"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recap List */}
      {loading ? (
        <div className="text-center text-slate-500 py-12 font-medium">Memuat data rekapan...</div>
      ) : filteredRecaps.length === 0 ? (
        <div className="text-center text-slate-500 py-12 font-medium bg-white rounded-2xl border border-slate-200 border-dashed">Belum ada data rekapan yang dipublikasikan pada rentang waktu ini.</div>
      ) : (
        <div className="space-y-12">
          {filteredRecaps.map((recap) => (
            <div key={recap.id} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden">
              
              {/* Badge Result */}
              {recap.result && (
                <div className={`absolute top-0 right-0 px-6 py-2 rounded-bl-3xl font-black text-sm uppercase tracking-widest text-white shadow-sm ${
                  recap.result === 'win' ? 'bg-green-500' : 
                  recap.result === 'lose' ? 'bg-red-500' : 
                  recap.result === 'pending' ? 'bg-amber-500' :
                  'bg-slate-700'
                }`}>
                  {recap.result === 'breakeven' ? 'BE' : recap.result === 'pending' ? 'PENDING' : recap.result}
                </div>
              )}

              <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-4 mt-4 md:mt-0">
                <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                  {format(new Date(recap.date), "dd MMMM yyyy", { locale: id })}
                </div>
                <div className="text-slate-400 text-sm font-medium">
                  {format(new Date(recap.created_at), "HH:mm")} WIB
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Before */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
                      Sebelum (Setup)
                    </h3>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative aspect-video cursor-pointer" onClick={() => window.open(recap.before_image_url, "_blank")}>
                    <img 
                      src={recap.before_image_url} 
                      alt="Setup Before" 
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                </div>

                {/* After */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-bold flex items-center gap-2 ${
                      recap.result === 'win' ? 'text-green-600' : 
                      recap.result === 'lose' ? 'text-red-600' : 
                      recap.result === 'pending' ? 'text-amber-500' :
                      'text-slate-600'
                    }`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        recap.result === 'win' ? 'bg-green-500' : 
                        recap.result === 'lose' ? 'bg-red-500' : 
                        recap.result === 'pending' ? 'bg-amber-400' :
                        'bg-slate-500'
                      }`}></div>
                      Sesudah (Hasil)
                    </h3>
                  </div>
                  <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 relative aspect-video cursor-pointer flex items-center justify-center">
                    {recap.after_image_url ? (
                      <img 
                        src={recap.after_image_url} 
                        alt="Setup After" 
                        onClick={() => window.open(recap.after_image_url, "_blank")}
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">⏳</span>
                        </div>
                        <h4 className="font-bold text-slate-700 text-lg mb-1">Menunggu Hasil</h4>
                        <p className="text-sm text-slate-500 font-medium">Trade ini masih berjalan atau belum direkap.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
