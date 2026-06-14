require('dotenv').config({ path: '../.env.local' });
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// Config
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!DISCORD_BOT_TOKEN || !DISCORD_CHANNEL_ID || !SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing environment variables. Please check your .env file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
  console.log(`Listening for images in channel: ${DISCORD_CHANNEL_ID}`);
});

client.on(Events.MessageCreate, async message => {
  // Ignore messages from bots or outside the target channel
  if (message.author.bot) return;
  if (message.channelId !== DISCORD_CHANNEL_ID) return;

  // Check if there are attachments
  if (message.attachments.size > 0) {
    const attachment = message.attachments.first();
    
    // Only process images
    if (attachment.contentType && attachment.contentType.startsWith('image/')) {
      console.log(`New image detected from ${message.author.username}`);
      
      try {
        // Fetch the image from Discord
        const response = await fetch(attachment.url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // Upload to Supabase Storage
        const fileExt = attachment.name.split('.').pop() || 'png';
        const fileName = `${message.id}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('testimonials')
          .upload(fileName, buffer, {
            contentType: attachment.contentType
          });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('testimonials')
          .getPublicUrl(fileName);
          
        // Save to Database
        const { error: dbError } = await supabase
          .from('testimonials')
          .insert([{
            discord_username: message.author.username,
            image_url: publicUrl,
            discord_message_id: message.id
          }]);
          
        if (dbError) {
            // Handle unique constraint if message was somehow processed twice
            if (dbError.code !== '23505') throw dbError;
        }

        console.log(`Successfully synced image from ${message.author.username}`);
      } catch (error) {
        console.error("Failed to process image:", error);
      }
    }
  }
});

client.login(DISCORD_BOT_TOKEN);
