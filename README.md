# NNOXE Trading Community Platform

This is the complete source code for the NNOXE Trading Community website and the accompanying Discord Bot.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL & Storage)
- Discord.js
- Framer Motion, Recharts, Shadcn UI (Customized)

## Setup Instructions

### 1. Supabase Setup
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Go to the SQL Editor and run the queries found in `supabase/schema.sql` to create your `recaps` and `testimonials` tables.
3. Go to Storage in Supabase and create TWO public buckets:
   - `recaps`
   - `testimonials`
4. Copy your **Project URL** and **Anon Key** from the Project Settings -> API page.

### 2. Discord Bot Setup
1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Go to the **Bot** tab, enable the following Privileged Gateway Intents:
   - Message Content Intent
   - Server Members Intent
3. Copy your **Bot Token**.
4. Go to **OAuth2 -> URL Generator**, select `bot` scope, and give it permissions (Read Messages/View Channels, Send Messages, Read Message History). Copy the URL and use it to invite the bot to your server.
5. In your Discord server, right-click the `#member-results` channel and select **Copy Channel ID** (you may need to enable Developer Mode in Discord settings).

### 3. Environment Variables
1. Rename `.env.example` to `.env.local` (for the Next.js app) and to `.env` (for the root if running the bot from root, or copy it to the `discord-bot` folder).
2. Fill in the values you collected above:
   ```env
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   DISCORD_BOT_TOKEN="your-discord-bot-token"
   DISCORD_CHANNEL_ID="your-discord-channel-id"
   ADMIN_PASSWORD="admin"
   ```

### 4. Running the Web Application
Make sure you have Node.js installed.
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Running the Discord Bot
The bot runs as a separate Node.js process to ensure it stays alive to listen to Discord events.
```bash
cd discord-bot
# Install dependencies for the bot
npm install

# Start the bot
npm start
```
When running successfully, it will log `Ready! Logged in as <BotName>` and start listening to the specified channel.
