require('dotenv').config({ path: '.env.local' });
const { Client, GatewayIntentBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;

if (!DISCORD_TOKEN || !DISCORD_CHANNEL_ID) {
  console.error("Token atau Channel ID belum diisi.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', async () => {
  console.log(`Bot berhasil login sebagai ${client.user.tag}`);
  
  try {
    const channel = await client.channels.fetch(DISCORD_CHANNEL_ID);
    if (!channel || !channel.isTextBased()) {
      console.log("Channel tidak ditemukan atau bukan channel teks.");
      process.exit(1);
    }

    console.log("Mengambil 100 pesan terakhir dari channel...");
    const messages = await channel.messages.fetch({ limit: 100 });
    
    let count = 0;

    for (const [messageId, message] of messages) {
      if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        if (attachment.contentType && attachment.contentType.startsWith('image/')) {
          
          // Cek apakah data ini sudah ada di database (mencegah duplikat)
          const { data: existingData } = await supabase
            .from('testimonials')
            .select('id')
            .eq('discord_message_id', message.id)
            .single();

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
              console.error(`Gagal upload storage untuk ${message.id}:`, uploadError.message);
              continue;
            }

            const { data: publicUrlData } = supabase.storage.from('testimonials').getPublicUrl(fileName);
            const finalUrl = publicUrlData.publicUrl;

            // 3. Simpan atau Update database
            if (existingData) {
              // UPDATE if exists
              const { error } = await supabase
                .from('testimonials')
                .update({ image_url: finalUrl })
                .eq('discord_message_id', message.id);
              if (error) console.error(`Gagal update pesan ${message.id}:`, error.message);
              else console.log(`✅ Berhasil memperbaiki gambar untuk ${message.author.username}`);
            } else {
              // INSERT if new
              const { error } = await supabase
                .from('testimonials')
                .insert([
                  {
                    discord_username: message.author.username,
                    image_url: finalUrl,
                    discord_message_id: message.id,
                    created_at: new Date(message.createdTimestamp).toISOString()
                  }
                ]);
              if (error) console.error(`Gagal menyimpan pesan ${message.id}:`, error.message);
              else console.log(`✅ Berhasil mengambil dan mengunggah gambar dari ${message.author.username}`);
            }
            count++;
          } catch (dlError) {
            console.error(`Gagal mendownload gambar dari discord: ${dlError.message}`);
          }
        }
      }
    }
    
    console.log(`\n🎉 Proses selesai! Berhasil menyalin ${count} gambar lama ke database website.`);
    process.exit(0);

  } catch (err) {
    console.error("Terjadi kesalahan:", err);
    process.exit(1);
  }
});

client.login(DISCORD_TOKEN);
