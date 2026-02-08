const { Client, GatewayIntentBits, Partials } = require("discord.js");
const admin = require("firebase-admin");

// 🔑 Carrega a chave que você baixou do Firebase
// Certifique-se que o arquivo "serviceAccountKey.json" está na mesma pasta!
const serviceAccount = require("./serviceAccountKey.json");

// 🚀 Inicializa o Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // 🔗 URL do seu banco de dados
  databaseURL: "https://ro-globalmessage-default-rtdb.firebaseio.com/" 
});

const db = admin.database();

// 🤖 Configuração do Bot Discord
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
  console.log(`Bot ${client.user.tag} online e conectado ao Firebase!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // 🛡️ SEGURANÇA: Só aceita comando do seu ID (841709448338472991)
  if (message.author.id !== "841709448338472991") return;

  // 📝 Comando: !GlobalMessage [texto]
  if (!message.content.startsWith("!GlobalMessage ")) return;

  const texto = message.content.slice(15).trim();
  if (!texto) return;

  // 📤 Salva a mensagem no Firebase
  // Isso cria uma entrada que o Roblox vai ler
  try {
    await db.ref("globalMessage").set({
      text: texto,
      author: message.author.tag,
      timestamp: Date.now()
    });

    await message.channel.send(`✅ Mensagem global enviada: "${texto}"`);
    console.log(`Mensagem global definida: ${texto}`);
  } catch (error) {
    console.error("Erro ao salvar no Firebase:", error);
    await message.channel.send("❌ Erro ao enviar mensagem global.");
  }
});

// 🔑 Token do Bot (configurado no Render)
client.login(process.env.DISCORD_TOKEN);