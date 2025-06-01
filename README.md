# Rivals Randomizer

A Discord bot that randomly assigns Marvel characters to players using slash commands for team formation. Perfect for games like Marvel Rivals or any team-based Marvel game!

## Features

- `/spin2` slash command that assigns 2 random Marvel characters to 2 players
- `/spin3` slash command that assigns 3 random Marvel characters to 3 players
- 39 different Marvel characters in the pool
- Automatic slash command registration
- Health check endpoint for monitoring
- Graceful shutdown handling
- Comprehensive error handling and logging

## Character Pool

The bot includes characters from various Marvel properties:
- **Vanguards:** Captain America, Doctor Strange, Emma Frost, Groot, Hulk, Magneto, Peni Parker, The Thing, Thor, Venom
- **Duelists:** Black Panther, Black Widow, Hawkeye, Hela, Human Torch, Iron Fist, Iron Man, Magik, Mister Fantastic, Moon Knight, Namor, Psylocke, Scarlet Witch, Spider-Man, Squirrel Girl, Star-Lord, Storm, The Punisher, Winter Soldier, Wolverine
- **Strategists:** Adam Warlock, Cloak & Dagger, Invisible Woman, Jeff the Land Shark, Loki, Luna Snow, Mantis, Rocket Raccoon, Ultron

## Setup Instructions

### 1. Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give your bot a name
3. Go to the "Bot" section and click "Add Bot"
4. Copy the bot token
5. Go to the "General Information" section and copy the Application ID (Client ID)

### 2. Environment Configuration

1. Copy `.env.example` to `.env`
2. Fill in your bot token and client ID:
   ```env
   BOT_TOKEN=your_actual_bot_token
   CLIENT_ID=your_actual_client_id
   ```

### 3. Bot Permissions

When inviting the bot to your server, ensure it has these permissions:
- Send Messages
- Use Slash Commands
- Read Message History

Use this permission integer: `2147483648`

### 4. Invite Bot to Server

Create an invite link using this format:
```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147483648&scope=bot%20applications.commands
```

Replace `YOUR_CLIENT_ID` with your actual Client ID.

## Deployment

This bot is deployed on [Northflank](https://northflank.com) and stays live 24/7. 

Developed with ❤️ by [Dharin Shah](https://github.com/DharinShah25)
