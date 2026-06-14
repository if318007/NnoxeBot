"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Plus, Pencil, Trash2, X, RefreshCw, BarChart3, MessageSquare } from "lucide-react";

type Recap = {
  id: string;
  date: string;
  result?: "win" | "lose" | "breakeven" | "pending";
  before_image_url: string;
  after_image_url?: string;
  created_at: string;
};

type Testimonial = {
  id: number;
  discord_username: string;
  image_url: string;
  created_at: string;
};

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const [activeTab, setActiveTab] = useState<"recaps" | "testimonials">("recaps");

  const [recaps, setRecaps] = useState<Recap[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [date, setDate] = useState("");
  const [result, setResult] = useState<"win" | "lose" | "breakeven" | "pending">("pending");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  
  // To keep track of existing images when editing
  const [existingBeforeUrl, setExistingBeforeUrl] = useState<string | null>(null);
  const [existingAfterUrl, setExistingAfterUrl] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setMessage({ type: 'error', text: 'Password salah' });
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recapsRes, testimonialsRes] = await Promise.all([
        supabase.from("recaps").select("*").order("date", { ascending: false }),
        supabase.from("testimonials").select("*").order("created_at", { ascending: false })
      ]);

      if (recapsRes.error) throw recapsRes.error;
      if (testimonialsRes.error) throw testimonialsRes.error;

      setRecaps(recapsRes.data || []);
      setTestimonials(testimonialsRes.data || []);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setDate("");
    setResult("pending");
    setBeforeFile(null);
    setAfterFile(null);
    setExistingBeforeUrl(null);
    setExistingAfterUrl(null);
    setMessage(null);
    setIsFormOpen(true);
  };

  const openEditForm = (recap: Recap) => {
    setEditingId(recap.id);
    setDate(recap.date);
    setResult(recap.result || "pending");
    setBeforeFile(null);
    setAfterFile(null);
    setExistingBeforeUrl(recap.before_image_url);
    setExistingAfterUrl(recap.after_image_url || null);
    setMessage(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handleDeleteRecap = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus rekapan ini?")) return;
    try {
      const { error } = await supabase.from('recaps').delete().eq('id', id);
      if (error) throw error;
      setRecaps(recaps.filter(r => r.id !== id));
      setMessage({ type: 'success', text: 'Rekapan berhasil dihapus!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal menghapus: ' + error.message });
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus testimoni ini?")) return;
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setTestimonials(testimonials.filter(t => t.id !== id));
      setMessage({ type: 'success', text: 'Testimoni berhasil dihapus!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal menghapus testimoni: ' + error.message });
    }
  };

  const handleUpload = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('recaps')
      .upload(`${folder}/${fileName}`, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('recaps')
      .getPublicUrl(`${folder}/${fileName}`);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi input
    if (!date) {
      setMessage({ type: 'error', text: 'Silakan isi tanggal' });
      return;
    }
    if (!editingId && !beforeFile) {
      setMessage({ type: 'error', text: 'Setup (Before) wajib diunggah untuk data baru' });
      return;
    }

    setSubmitLoading(true);
    setMessage(null);

    try {
      let finalBeforeUrl = existingBeforeUrl;
      let finalAfterUrl = existingAfterUrl;

      // 1. Upload Gambar Baru (Jika Ada)
      if (beforeFile) {
        finalBeforeUrl = await handleUpload(beforeFile, 'before');
      }
      if (afterFile) {
        finalAfterUrl = await handleUpload(afterFile, 'after');
      }

      const payload: any = {
        date,
        result: (afterFile || finalAfterUrl) && result === 'pending' ? 'win' : result, // Default to win if pending but uploaded
        before_image_url: finalBeforeUrl,
        after_image_url: finalAfterUrl || null,
      };

      if (!finalAfterUrl) {
         payload.result = 'pending';
      }

      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from('recaps')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase
          .from('recaps')
          .insert([payload]);
        if (error) throw error;
      }

      setMessage({ type: 'success', text: `Data berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!` });
      await fetchData();
      closeForm();
      setTimeout(() => setMessage(null), 3000);

    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: error.message || 'Gagal menyimpan data' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 bg-slate-50">
        <Card className="w-full max-w-md bg-white border-slate-200 shadow-xl rounded-3xl">
          <CardHeader className="text-center pb-4 pt-8">
            <CardTitle className="text-2xl font-extrabold text-slate-900">Akses Admin</CardTitle>
            <CardDescription className="text-slate-500 font-medium">Masukkan password untuk mengelola rekapan.</CardDescription>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                type="password" 
                placeholder="Password Admin" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-900 focus:ring-blue-500 focus:border-blue-500 rounded-xl py-6"
              />
              {message && <p className="text-red-500 text-sm font-medium">{message.text}</p>}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-6 shadow-md shadow-blue-500/20">Masuk</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold flex items-center gap-3 text-slate-900 tracking-tight">
            <Upload className="text-blue-600 h-8 w-8" />
            Dashboard Admin
          </h1>
          {activeTab === 'recaps' && (
            <Button onClick={openAddForm} className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-6 px-6 shadow-md">
              <Plus className="mr-2 h-5 w-5" /> Tambah Data Baru
            </Button>
          )}
        </div>

        {/* Menu Tab */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
          <button 
            onClick={() => setActiveTab('recaps')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'recaps' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BarChart3 className="w-4 h-4 mr-2" /> Manajemen Rekapan
          </button>
          <button 
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'testimonials' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Manajemen Testimoni
          </button>
        </div>

        {message && !isFormOpen && (
          <div className={`p-4 rounded-xl font-medium mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {/* FORM RECAPS */}
        {isFormOpen && activeTab === 'recaps' && (
          <Card className="bg-white border-slate-200 shadow-xl rounded-3xl overflow-hidden mb-12">
            <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row justify-between items-center px-8 py-6">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900">{editingId ? "Edit Rekapan" : "Tambah Rekapan Baru"}</CardTitle>
                <CardDescription>Form ini mendukung upload secara parsial. Anda bisa upload 'Setup' duluan, lalu edit lagi nanti untuk upload 'Hasil'.</CardDescription>
              </div>
              <Button variant="ghost" onClick={closeForm} className="rounded-full w-10 h-10 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-200">
                <X className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="p-8 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Trading</label>
                    <Input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Hasil Trade</label>
                    <div className="grid grid-cols-4 gap-2">
                      <div 
                        onClick={() => setResult('pending')}
                        className={`cursor-pointer rounded-xl border ${result === 'pending' ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'} p-3 flex flex-col items-center justify-center transition-all`}
                      >
                        <span className="font-bold text-xs">Pending</span>
                      </div>
                      <div 
                        onClick={() => setResult('win')}
                        className={`cursor-pointer rounded-xl border ${result === 'win' ? 'bg-green-50 border-green-500 ring-2 ring-green-500/20 text-green-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'} p-3 flex flex-col items-center justify-center transition-all`}
                      >
                        <span className="font-bold text-xs">Win</span>
                      </div>
                      <div 
                        onClick={() => setResult('lose')}
                        className={`cursor-pointer rounded-xl border ${result === 'lose' ? 'bg-red-50 border-red-500 ring-2 ring-red-500/20 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'} p-3 flex flex-col items-center justify-center transition-all`}
                      >
                        <span className="font-bold text-xs">Lose</span>
                      </div>
                      <div 
                        onClick={() => setResult('breakeven')}
                        className={`cursor-pointer rounded-xl border ${result === 'breakeven' ? 'bg-slate-800 border-slate-900 ring-2 ring-slate-900/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'} p-3 flex flex-col items-center justify-center transition-all`}
                      >
                        <span className="font-bold text-xs">BE</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-5 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:border-blue-400 transition-colors">
                    <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wider">Gambar SEBELUM <span className="text-slate-400 font-normal">(Setup)</span></label>
                    <p className="text-xs text-slate-500 mb-4">{existingBeforeUrl ? 'Gambar sudah ada. Upload baru untuk mengganti.' : 'Wajib diisi.'}</p>
                    <input 
                      id="beforeFile"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setBeforeFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-slate-700 file:shadow-sm hover:file:bg-slate-100 cursor-pointer"
                      required={!existingBeforeUrl}
                    />
                    {existingBeforeUrl && !beforeFile && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 aspect-video bg-white">
                        <img src={existingBeforeUrl} alt="Existing Before" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 hover:border-blue-400 transition-colors">
                    <label className="block text-sm font-extrabold text-slate-700 mb-2 uppercase tracking-wider">Gambar SESUDAH <span className="text-slate-400 font-normal">(Hasil)</span></label>
                    <p className="text-xs text-slate-500 mb-4">{existingAfterUrl ? 'Gambar sudah ada. Upload baru untuk mengganti.' : 'Opsional. Bisa diisi nanti.'}</p>
                    <input 
                      id="afterFile"
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setAfterFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-white file:text-slate-700 file:shadow-sm hover:file:bg-slate-100 cursor-pointer"
                    />
                    {existingAfterUrl && !afterFile && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 aspect-video bg-white">
                        <img src={existingAfterUrl} alt="Existing After" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                {message && isFormOpen && (
                  <div className={`p-4 rounded-xl font-medium flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {message.text}
                  </div>
                )}

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl py-7 text-lg shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02]"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Menyimpan..." : <><Plus className="mr-2 h-5 w-5" /> Simpan Rekapan</>}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={closeForm}
                    className="flex-1 border-slate-300 text-slate-700 font-bold rounded-xl py-7 text-lg"
                    disabled={submitLoading}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* LIST RECAPS / TESTIMONIALS */}
        <Card className="bg-white border-slate-200 shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-50 flex flex-row items-center justify-between py-5 px-8">
            <CardTitle className="text-xl font-bold text-slate-800">
              {activeTab === 'recaps' ? 'Daftar Rekapan' : 'Daftar Testimoni'}
            </CardTitle>
            <Button variant="outline" size="sm" onClick={fetchData} className="rounded-full bg-white font-bold text-slate-600">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center text-slate-500 font-medium">Memuat data...</div>
            ) : activeTab === 'recaps' ? (
              /* TAB RECAPS */
              recaps.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium">Belum ada data rekapan.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100">
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider">Tanggal</th>
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider">Status</th>
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider">Setup</th>
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider">Hasil</th>
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recaps.map(recap => (
                        <tr key={recap.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                          <td className="p-5 font-bold text-slate-800">{recap.date}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full ${
                              recap.result === 'win' ? 'bg-green-100 text-green-700' : 
                              recap.result === 'lose' ? 'bg-red-100 text-red-700' : 
                              recap.result === 'breakeven' ? 'bg-slate-200 text-slate-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {recap.result || 'pending'}
                            </span>
                          </td>
                          <td className="p-5">
                            {recap.before_image_url ? (
                              <img src={recap.before_image_url} alt="Before" className="h-10 w-16 object-cover rounded border border-slate-200 cursor-pointer" onClick={() => window.open(recap.before_image_url)} />
                            ) : <span className="text-slate-400 text-sm">-</span>}
                          </td>
                          <td className="p-5">
                            {recap.after_image_url ? (
                              <img src={recap.after_image_url} alt="After" className="h-10 w-16 object-cover rounded border border-slate-200 cursor-pointer" onClick={() => window.open(recap.after_image_url)} />
                            ) : <span className="text-amber-500 font-medium text-xs bg-amber-50 px-2 py-1 rounded">PENDING</span>}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditForm(recap)} className="border-slate-200 text-blue-600 hover:bg-blue-50">
                                <Pencil className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteRecap(recap.id)} className="border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            ) : (
              /* TAB TESTIMONIALS */
              testimonials.length === 0 ? (
                <div className="p-12 text-center text-slate-500 font-medium">Belum ada data testimoni.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-slate-100">
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider">Username</th>
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider">Gambar</th>
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider">Tgl Input</th>
                        <th className="p-5 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.map(testi => (
                        <tr key={testi.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                          <td className="p-5 font-bold text-slate-800">@{testi.discord_username}</td>
                          <td className="p-5">
                            {testi.image_url ? (
                              <img src={testi.image_url} alt="Testimoni" className="h-10 w-auto max-w-[120px] object-cover rounded border border-slate-200 cursor-pointer" onClick={() => window.open(testi.image_url)} />
                            ) : <span className="text-slate-400 text-sm">-</span>}
                          </td>
                          <td className="p-5 text-sm text-slate-600">
                            {new Date(testi.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                          </td>
                          <td className="p-5 text-right">
                            <Button variant="outline" size="sm" onClick={() => handleDeleteTestimonial(testi.id)} className="border-slate-200 text-red-600 hover:bg-red-50 hover:border-red-200">
                              <Trash2 className="h-4 w-4 mr-1" /> Hapus
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
