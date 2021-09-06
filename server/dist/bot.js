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
exports.Bot = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const Bot = (token) => {
    const client = new discord_js_1.default.Client({ intents: ['GUILDS', 'GUILD_MEMBERS'] });
    client.on('ready', () => {
        console.log('Connected to Discord');
    });
    client.login(token);
    return {
        getGuilds: () => __awaiter(void 0, void 0, void 0, function* () {
            const guilds = yield client.guilds.fetch();
            return guilds.map(guild => { return { id: guild.id, name: guild.name }; });
        }),
        getVoiceChannels: (guildId) => __awaiter(void 0, void 0, void 0, function* () {
            const guild = client.guilds.resolve(guildId);
            if (!guild) {
                return [];
            }
            const channels = yield guild.channels.fetch();
            return channels.filter(c => c.type == 'GUILD_VOICE')
                .map(c => { return { id: c.id, name: c.name }; });
        }),
        getMembers: (guildId) => __awaiter(void 0, void 0, void 0, function* () {
            const guild = client.guilds.resolve(guildId);
            if (!guild) {
                return [];
            }
            const members = yield guild.members.fetch();
            return members
                .filter(member => !member.user.bot)
                .map(member => {
                var _a;
                return {
                    id: member.id,
                    name: (_a = member.nickname) !== null && _a !== void 0 ? _a : member.displayName
                };
            });
        }),
        sendMembersToVoiceChannels: (guildId, channelMembers) => __awaiter(void 0, void 0, void 0, function* () {
            const guild = client.guilds.resolve(guildId);
            if (!guild) {
                return [];
            }
            for (const channel of channelMembers) {
                const voiceChannel = yield guild.channels.fetch(channel.id);
                if (!voiceChannel || !voiceChannel.isVoice()) {
                    continue;
                }
                for (const memberId of channel.memberIds) {
                    const member = yield guild.members.fetch(memberId);
                    if (!member) {
                        continue;
                    }
                    try {
                        yield member.voice.setChannel(channel.id);
                    }
                    catch (error) {
                        console.error(`Error moving member to voice channel: ${error}`);
                    }
                }
            }
        })
    };
};
exports.Bot = Bot;
;
