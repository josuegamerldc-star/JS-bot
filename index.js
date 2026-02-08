const { Client, GatewayIntentBits, Partials } = require("discord.js");

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
  console.log("JS online");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Só aceita DM
  if (message.channel.type !== 1) return;

  if (!message.content.startsWith("!ms ")) return;

  const texto = message.content.slice(4).trim();
  if (!texto) return;

  // 🔍 Procurar o servidor "Js Studios"
  const guild = client.guilds.cache.find(
    g => g.name === "Js Studios"
  );

  if (!guild) {
    return message.channel.send("❌ seu betinha, não achei o servidor aq, acho q tô fora dele kapa kapa");
  }

  // 🔍 Procurar o canal "avisos-e-bans"
  const canal = guild.channels.cache.find(
    c => c.name === "avisos-e-bans" && c.isTextBased()
  );

  if (!canal) {
    return message.channel.send("❌ tô no serv, mas nn achei o canal nah");
  }

  // 📤 Enviar mensagem
  await canal.send(
    `📢 **Mensagem enviada por ${message.author.tag}:**\n${texto}`
  );

  // 📬 Confirmar na DM
  await message.channel.send("enviei tropa");
});

client.login(process.env.DISCORD_TOKEN);

