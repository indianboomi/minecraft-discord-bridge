const { Client, GatewayIntentBits } = require('discord.js');
const WebSocket = require('ws');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const ws = new WebSocket('ws://localhost:3001');

ws.on('open', () => console.log("Connected to Minecraft plugin"));

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // Send Discord chat to Minecraft
  ws.send(JSON.stringify({
    type: "chat",
    user: message.author.username,
    content: message.content
  }));

  // Command example
  if (message.content.startsWith("!cmd ")) {
    const cmd = message.content.replace("!cmd ", "");
    ws.send(JSON.stringify({
      type: "command",
      command: cmd
    }));
  }
});

ws.on('message', (data) => {
  const msg = JSON.parse(data);

  if (msg.type === "mc_chat") {
    const channel = client.channels.cache.get("YOUR_CHANNEL_ID");
    channel.send(`**${msg.player}**: ${msg.message}`);
  }
});

client.login("YOUR_DISCORD_BOT_TOKEN");
