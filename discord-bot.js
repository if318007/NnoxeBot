require('dotenv').config({ path: '.env.local' });
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// Konfigurasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Konfigurasi Discord Bot
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, c => {
  console.log(`✅ Sukses! Bot Discord [${c.user.tag}] telah aktif dan memantau channel.`);
});

client.on(Events.MessageCreate, async (message) => {
  // Abaikan pesan dari bot itu sendiri
  if (message.author.bot) return;

  // Pastikan pesan berada di channel yang benar
  if (message.channelId !== DISCORD_CHANNEL_ID) return;

  // Periksa apakah pesan mengandung attachment (gambar)
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    
    // Pastikan attachment adalah gambar
    if (attachment.contentType && attachment.contentType.startsWith('image/')) {
      console.log(`\n📸 Mendeteksi gambar baru dari: ${message.author.username}`);
      console.log(`URL Gambar: ${attachment.url}`);

      try {
        // 1. Download image dari Discord
        const response = await fetch(attachment.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // 2. Upload ke Supabase Storage
        const fileName = `discord_${Date.now()}_${message.id}.jpg`;
        const { error: uploadError } = await supabase
          .storage
          .from('testimonials')
          .upload(fileName, buffer, { contentType: attachment.contentType, upsert: true });

        if (uploadError) {
          console.error("❌ Gagal upload storage:", uploadError.message);
          return;
        }

        const { data: publicUrlData } = supabase.storage.from('testimonials').getPublicUrl(fileName);
        const finalUrl = publicUrlData.publicUrl;

        // 3. Simpan ke database Supabase tabel 'testimonials'
        const { data, error } = await supabase
          .from('testimonials')
          .insert([
            {
              discord_username: message.author.username,
              image_url: finalUrl,
              discord_message_id: message.id
            }
          ]);

        if (error) {
          console.error("❌ Gagal menyimpan ke database:", error.message);
        } else {
          console.log("💾 Berhasil disimpan ke Supabase! Testimoni langsung muncul di website.");
          // Opsional: Bot bisa memberi reaksi ceklis (✅) pada pesan di Discord jika berhasil
          await message.react('✅');
        }
      } catch (err) {
        console.error("❌ Terjadi kesalahan sistem:", err);
      }
    }
  }
});

if (!DISCORD_TOKEN) {
  console.error("❌ ERROR: DISCORD_TOKEN belum diisi di file .env.local!");
  process.exit(1);
}

if (!DISCORD_CHANNEL_ID) {
  console.error("❌ ERROR: DISCORD_CHANNEL_ID belum diisi di file .env.local!");
  process.exit(1);
}

client.login(DISCORD_TOKEN);
