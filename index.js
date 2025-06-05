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

const players = ["LordMHK", "HoeLander", "DSKicker"];
const characters = [
    "CAPTAIN AMERICA 🛡️",
    "DOCTOR STRANGE 🛡️",
    "EMMA FROST 🛡️",
    "GROOT 🛡️",
    "HULK 🛡️",
    "MAGNETO 🛡️",
    "PENI PARKER 🛡️",
    "THE THING 🛡️",
    "THOR 🛡️",
    "VENOM 🛡️",
    "BLACK PANTHER ⚔️",
    "BLACK WIDOW ⚔️",
    "HAWKEYE ⚔️",
    "HELA ⚔️",
    "HUMAN TORCH ⚔️",
    "IRON FIST ⚔️",
    "IRON MAN ⚔️",
    "MAGIK ⚔️",
    "MISTER FANTASTIC ⚔️",
    "MOON KNIGHT ⚔️",
    "NAMOR ⚔️",
    "PSYLOCKE ⚔️",
    "SCARLET WITCH ⚔️",
    "SPIDER-MAN ⚔️",
    "SQUIRREL GIRL ⚔️",
    "STAR-LORD ⚔️",
    "STORM ⚔️",
    "THE PUNISHER ⚔️",
    "WINTER SOLDIER ⚔️",
    "WOLVERINE ⚔️",
    "ADAM WARLOCK ❤️‍🩹",
    "CLOAK & DAGGER ❤️‍🩹",
    "INVISIBLE WOMAN ❤️‍🩹",
    "JEFF THE LAND SHARK ❤️‍🩹",
    "LOKI ❤️‍🩹",
    "LUNA SNOW ❤️‍🩹",
    "MANTIS ❤️‍🩹",
    "ROCKET RACCOON ❤️‍🩹",
    "ULTRON ❤️‍🩹",
];

function getRandomCharacters(count = 3) {
    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

async function registerCommands() {
    const commands = [
        new SlashCommandBuilder()
            .setName("spin2")
            .setDescription("Assigns 2 random Marvel characters for 2 players"),
        new SlashCommandBuilder()
            .setName("spin3")
            .setDescription("Assigns 3 random Marvel characters for 3 players"),
        new SlashCommandBuilder()
            .setName("healer")
            .setDescription("Assigns a random healer to a random player"),
        new SlashCommandBuilder()
            .setName("purge")
            .setDescription("Delete a number of messages from the channel")
            .addIntegerOption(option =>
                option.setName("count")
                    .setDescription("Number of messages to delete (1–100)")
                    .setRequired(true)),
    ];

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN);

    try {
        console.log("📡 Registering slash commands...");
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
            body: commands.map(cmd => cmd.toJSON()),
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
                `🎮 **Duo Spin Results:**\n` +
                `1️⃣ LordMHK   – **${char1}**\n` +
                `2️⃣ HoeLander – **${char2}**\n\n`;
            await interaction.reply(response);
        } catch (error) {
            console.error("Error in /spin2:", error);
            await interaction.reply("Something went wrong with /spin2.");
        }
    } else if (interaction.commandName === "spin3") {
        try {
            const [char1, char2, char3] = getRandomCharacters(3);
            const response =
                `🎮 **Trio Spin Results:**\n` +
                `1️⃣ DSKicker  – **${char1}**\n` +
                `2️⃣ LordMHK   – **${char2}**\n` +
                `3️⃣ HoeLander – **${char3}**\n\n`;
            await interaction.reply(response);
        } catch (error) {
            console.error("Error in /spin3:", error);
            await interaction.reply("Something went wrong with /spin3.");
        }
    } else if (interaction.commandName === "purge") {
        const amount = interaction.options.getInteger("count");

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: "Please enter a number between 1 and 100.", ephemeral: true });
        }

        try {
            await interaction.deferReply({ ephemeral: true }); // ⬅️ prevents timeout
            const deleted = await interaction.channel.bulkDelete(amount, true);
            await interaction.editReply({ content: `🧹 Deleted ${deleted.size} messages.` });
        } catch (error) {
            console.error("Error in /purge:", error);
            await interaction.editReply({ content: "❌ Failed to delete messages. Do I have permission?" });
        }
    } else if (interaction.commandName === "healer") {
            try {
                const healerCharacters = characters.filter(char => char.includes("❤️‍🩹"));
                const healer = healerCharacters[Math.floor(Math.random() * healerCharacters.length)];
                const player = players[Math.floor(Math.random() * players.length)];
                const response = `💉 **Healer Assignment:**\n` +
                                `➡️ ${player} - **${healer}**`;
                await interaction.reply(response);
            } catch (error) {
                console.error("Error in /healer:", error);
                await interaction.reply("Something went wrong with /healer.");
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
            })
        );
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Bot is running.");
    }
});
server.listen(5000, "0.0.0.0", () => {
    console.log("🌐 Health check server on port 5000");
});
