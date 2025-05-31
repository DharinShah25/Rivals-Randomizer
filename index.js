import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Discord client with necessary intents
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ] 
});

// Marvel characters list (appears to be from Marvel Rivals or similar game)
const characters = [
    "Captain America", "Doctor Strange", "Emma Frost", "Groot", "Hulk", "Magneto", "Peni Parker",
    "The Thing", "Thor", "Venom", "Black Panther", "Black Widow", "Hawkeye", "Hela", "Human Torch",
    "Iron Fist", "Iron Man", "Magik", "Mister Fantastic", "Moon Knight", "Namor", "Psylocke",
    "Scarlet Witch", "Spider-Man", "Squirrel Girl", "Star-Lord", "Storm", "The Punisher",
    "Winter Soldier", "Wolverine", "Adam Warlock", "Cloak & Dagger", "Invisible Woman",
    "Jeff the Land Shark", "Loki", "Luna Snow", "Mantis", "Rocket Raccoon", "Ultron"
];

/**
 * Randomly selects characters from the character pool
 * @param {number} count - Number of characters to select (default: 3)
 * @returns {string[]} Array of randomly selected character names
 */
function getRandomCharacters(count = 3) {
    // Create a copy of the characters array and shuffle it
    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Registers slash commands with Discord API
 */
async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName('spinteam')
            .setDescription('Assigns 3 random Marvel characters to 3 players for team formation')
            .toJSON()
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    try {
        console.log('📡 Starting registration of slash commands...');
        
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        
        console.log('✅ Successfully registered slash commands.');
    } catch (error) {
        console.error('❌ Error registering slash commands:', error);
        throw error;
    }
}

// Event handler for when the bot is ready
client.once('ready', async () => {
    console.log(`🤖 Bot logged in successfully as ${client.user.tag}`);
    console.log(`🎮 Ready to spin teams with ${characters.length} Marvel characters!`);
    
    // Register slash commands when bot is ready
    try {
        await registerCommands();
    } catch (error) {
        console.error('Failed to register commands. Bot may not respond to slash commands.');
    }
});

// Event handler for slash command interactions
client.on('interactionCreate', async interaction => {
    // Only handle chat input commands (slash commands)
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'spinteam') {
        try {
            // Get 3 random characters
            const [char1, char2, char3] = getRandomCharacters(3);
            
            // Create formatted response
            const response = `🎮 **Team Spin Results:**\n` +
                           `🦸 Player 1 – **${char1}**\n` +
                           `🦸 Player 2 – **${char2}**\n` +
                           `🦸 Player 3 – **${char3}**\n\n` +
                           `Good luck, heroes! 🚀`;

            await interaction.reply(response);
            
            console.log(`Team generated for ${interaction.user.tag}: ${char1}, ${char2}, ${char3}`);
        } catch (error) {
            console.error('Error handling spinteam command:', error);
            
            // Send error response to user
            const errorMessage = 'Sorry, there was an error generating your team. Please try again!';
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    }
});

// Error handling for the Discord client
client.on('error', error => {
    console.error('Discord client error:', error);
});

client.on('warn', warning => {
    console.warn('Discord client warning:', warning);
});

// Handle process termination gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT. Shutting down Discord bot gracefully...');
    client.destroy();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM. Shutting down Discord bot gracefully...');
    client.destroy();
    process.exit(0);
});

// Validate required environment variables
if (!process.env.BOT_TOKEN) {
    console.error('❌ BOT_TOKEN environment variable is required');
    process.exit(1);
}

if (!process.env.CLIENT_ID) {
    console.error('❌ CLIENT_ID environment variable is required');
    process.exit(1);
}

// Login to Discord
console.log('🚀 Starting Discord bot...');
client.login(process.env.BOT_TOKEN).catch(error => {
    console.error('❌ Failed to login to Discord:', error);
    process.exit(1);
});

// Optional: Create a simple HTTP server for health checks (since backend should bind to port 8000)
import http from 'http';

const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            bot: client.isReady() ? 'online' : 'offline',
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Discord Bot is running. Use Discord slash commands to interact.');
    }
});

server.listen(8000, '0.0.0.0', () => {
    console.log('🌐 Health check server listening on port 8000');
});
