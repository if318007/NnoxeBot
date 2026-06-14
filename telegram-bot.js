require('dotenv').config({ path: '.env.local' });
const TelegramBot = require('node-telegram-bot-api');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Konfigurasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Konfigurasi Telegram Bot
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_TOKEN) {
  console.error("❌ ERROR: TELEGRAM_BOT_TOKEN belum diisi di file .env.local!");
  console.log("👉 Silakan dapatkan token dari @BotFather di Telegram.");
  process.exit(1);
}

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

console.log("✅ Sukses! Bot Telegram telah aktif dan memantau pesan.");

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Jika pesan bukan gambar, abaikan
  if (!msg.photo) return;

  try {
    console.log(`\n📸 Mendeteksi gambar baru dari: ${msg.from.username || msg.from.first_name}`);

    // Telegram mengirimkan gambar dalam berbagai resolusi. Ambil resolusi terbesar (array terakhir)
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;

    // Dapatkan URL download sementara dari Telegram API
    const fileLink = await bot.getFileLink(fileId);

    // Download gambar sebagai buffer
    const response = await fetch(fileLink);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Buat nama file yang unik
    const fileName = `tele_${Date.now()}_${msg.from.id}.jpg`;

    // 1. Upload gambar ke Supabase Storage (Pastikan Anda sudah membuat bucket bernama 'testimonials' dan diset Public)
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('testimonials')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error("❌ Gagal mengunggah gambar ke Supabase Storage:", uploadError.message);
      console.log("💡 TIP: Apakah Anda sudah membuat Storage Bucket bernama 'testimonials' di dashboard Supabase dan mensetnya menjadi 'Public'?");
      bot.sendMessage(chatId, "❌ Gagal menyimpan gambar. Pastikan bucket Supabase sudah dikonfigurasi.");
      return;
    }

    // 2. Dapatkan URL publik dari gambar yang baru diunggah
    const { data: publicUrlData } = supabase
      .storage
      .from('testimonials')
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Simpan data ke tabel 'testimonials'
    const { data, error } = await supabase
      .from('testimonials')
      .insert([
        {
          discord_username: msg.from.username || msg.from.first_name, // Menggunakan username Telegram
          image_url: publicUrl
        }
      ]);

    if (error) {
      console.error("❌ Gagal menyimpan ke database:", error.message);
      bot.sendMessage(chatId, "❌ Gambar berhasil diunggah, tapi gagal menyimpan data ke tabel database.");
    } else {
      console.log("💾 Berhasil disimpan ke Supabase! Testimoni langsung muncul di website.");
      bot.sendMessage(chatId, "✅ Testimoni berhasil ditambahkan ke Website NNOXE!");
    }
  } catch (err) {
    console.error("❌ Terjadi kesalahan sistem:", err);
    bot.sendMessage(chatId, "❌ Terjadi kesalahan sistem internal.");
  }
});
