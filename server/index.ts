import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { Bot } from './bot';

const wwwPath = path.join(__dirname, 'www');
const PORT = 80;

const botToken = process.env.DISCORD_BOT_TOKEN;
if (!botToken) {
  console.error('The environment variable DISCORD_BOT_TOKEN is missing.');
  process.exit(1);
}
const bot = Bot(botToken);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/guilds', async (_, res) => {
  res.send(await bot.getGuilds());
});

app.get('/guilds/:guildId/voice-channels', async (req, res) => {
  const guildId = req.params.guildId;
  res.send(await bot.getVoiceChannels(guildId));
});

app.get('/guilds/:guildId/members', async (req, res) => {
  const guildId = req.params.guildId;
  res.send(await bot.getMembers(guildId));
});

app.post('/guilds/:guildId/send-members-to-channels', async (req, res) => {
  const guildId = req.params.guildId;
  await bot.sendMembersToVoiceChannels(guildId, req.body);
  res.send();
});

if (fs.existsSync(wwwPath)) {
  app.use(express.static(wwwPath));
}

app.listen(PORT);