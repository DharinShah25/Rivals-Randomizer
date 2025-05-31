const {
    Client,
    GatewayIntentBits,
    SlashCommandBuilder,
    REST,
    Routes,
} = require("discord.js");
const dotenv = require("dotenv");

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const characters = [
    "Captain America",
    "Doctor Strange",
    "Emma Frost",
    "Groot",
    "Hulk",
    "Magneto",
    "Peni Parker",
    "The Thing",
    "Thor",
    "Venom",
    "Black Panther",
    "Black Widow",
    "Hawkeye",
    "Hela",
    "Human Torch",
    "Iron Fist",
    "Iron Man",
    "Magik",
    "Mister Fantastic",
    "Moon Knight",
    "Namor",
    "Psylocke",
    "Scarlet Witch",
    "Spider-Man",
    "Squirrel Girl",
    "Star-Lord",
    "Storm",
    "The Punisher",
    "Winter Soldier",
    "Wolverine",
    "Adam Warlock",
    "Cloak & Dagger",
    "Invisible Woman",
    "Jeff the Land Shark",
    "Loki",
    "Luna Snow",
    "Mantis",
    "Rocket Raccoon",
    "Ultron",
];

function getRandomCharacters(count = 3) {
    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName("spin2")
            .setDescription("Assigns 2 random Marvel characters for 2 players")
            .toJSON(),
        new SlashCommandBuilder()
            .setName("spin3")
            .setDescription("Assigns 3 random Marvel characters for 3 players")
            .toJSON(),
    ];

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    try {
        console.log("📡 Registering slash commands...");
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands,
        });
        console.log("✅ Slash commands registered.");
    } catch (error) {
        console.error("❌ Error registering commands:", error);
    }
}

client.once("ready", async () => {
    console.log(`🤖 Logged in as ${client.user.tag}`);
    await registerCommands();
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "spin2") {
        try {
            const [char1, char2] = getRandomCharacters(2);
            const response =
                `🎮 **Team Spin Results:**\n` +
                `1️⃣ Player 1 – **${char1}**\n` +
                `2️⃣ Player 2 – **${char2}**\n\n` +
                `Good luck, heroes! 🦸‍♂️`;
            await interaction.reply(response);
        } catch (error) {
            console.error("Error in /spin2:", error);
            await interaction.reply("Something went wrong with /spin2.");
        }
    } else if (interaction.commandName === "spin3") {
        try {
            const [char1, char2, char3] = getRandomCharacters(3);
            const response =
                `🎮 **Team Spin Results:**\n` +
                `1️⃣ Player 1 – **${char1}**\n` +
                `2️⃣ Player 2 – **${char2}**\n` +
                `3️⃣ Player 3 – **${char3}**\n\n` +
                `Let’s go! 🚀`;
            await interaction.reply(response);
        } catch (error) {
            console.error("Error in /spin3:", error);
            await interaction.reply("Something went wrong with /spin3.");
        }
    }
});

client.on("error", (error) => console.error("Client error:", error));
client.on("warn", (warning) => console.warn("Client warning:", warning));

process.on("SIGINT", () => {
    console.log("🛑 SIGINT received. Exiting...");
    client.destroy();
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("🛑 SIGTERM received. Exiting...");
    client.destroy();
    process.exit(0);
});

if (!process.env.BOT_TOKEN || !process.env.CLIENT_ID) {
    console.error("❌ Missing BOT_TOKEN or CLIENT_ID in .env");
    process.exit(1);
}

console.log("🚀 Launching bot...");
client.login(process.env.BOT_TOKEN);

// Optional health check server
const http = require("http");
const server = http.createServer((req, res) => {
    if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                status: "healthy",
                bot: client.isReady() ? "online" : "offline",
                timestamp: new Date().toISOString(),
            }),
        );
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Bot is running.");
    }
});
server.listen(5000, "0.0.0.0", () => {
    console.log("🌐 Health check server on port 5000");
});
