"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const bot_1 = require("./bot");
const wwwPath = path_1.default.join(__dirname, 'www');
const PORT = 80;
const botToken = process.env.DISCORD_BOT_TOKEN;
if (!botToken) {
    console.error('The environment variable DISCORD_BOT_TOKEN is missing.');
    process.exit(1);
}
const bot = (0, bot_1.Bot)(botToken);
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded());
app.get('/guilds', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(yield bot.getGuilds());
}));
app.get('/guilds/:guildId/voice-channels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guildId = req.params.guildId;
    res.send(yield bot.getVoiceChannels(guildId));
}));
app.get('/guilds/:guildId/members', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guildId = req.params.guildId;
    res.send(yield bot.getMembers(guildId));
}));
app.post('/guilds/:guildId/send-members-to-channels', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const guildId = req.params.guildId;
    yield bot.sendMembersToVoiceChannels(guildId, req.body);
    res.send();
}));
if (fs_1.default.existsSync(wwwPath)) {
    console.log(`Serving from ${wwwPath}`);
    app.use(express_1.default.static(wwwPath));
}
app.listen(PORT);
