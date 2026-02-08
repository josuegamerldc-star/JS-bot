const { Client, GatewayIntentBits, Partials } = require("discord.js");
const admin = require("firebase-admin");

// 🔑 Carrega a chave que você baixou do Firebase
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // 🔗 URL correta do seu banco de dados
  databaseURL: "https://ro-globalmessage-default-rtdb.firebaseio.com/" 
});

const db = admin.database();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.once("ready", () => {
  console.log("JS online e conectado ao Firebase!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // 🛡️ SEGURANÇA: Só aceita comando do seu ID
  if (message.author.id !== "841709448338472991") return;

  // 📝 Comando para DM ou Canal
  if (!message.content.startsWith("!GlobalMessage ")) return;

  const texto = message.content.slice(15).trim();
  if (!texto) return;

  // 📤 Salva a mensagem no Firebase
  // Isso cria uma entrada que o Roblox vai ler
  await db.ref("globalMessage").set({
    text: texto,
    author: message.author.tag,
    timestamp: Date.now()
  });

  await message.channel.send(`✅ Mensagem global enviada: "${texto}"`);
});

// 🔑 Token do Bot (configurado no Render)
client.login(process.env.DISCORD_TOKEN);
