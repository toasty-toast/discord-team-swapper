import Discord from 'discord.js';

export const Bot = (token: string) => {
  const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MEMBERS'] });

  client.on('ready', () => {
    console.log('Connected to Discord');
  });

  client.login(token);

  return {
    getGuilds: async (): Promise<Guild[]> => {
      const guilds = await client.guilds.fetch();
      return guilds.map<Guild>(guild => { return { id: guild.id, name: guild.name } });
    },

    getVoiceChannels: async (guildId: string): Promise<VoiceChannel[]> => {
      const guild = client.guilds.resolve(guildId);
      if (!guild) {
        return [];
      }

      const channels = await guild.channels.fetch();
      return channels.filter(c => c.type == 'GUILD_VOICE')
        .map(c => { return { id: c.id, name: c.name } });
    },

    getMembers: async (guildId: string): Promise<GuildMember[]> => {
      const guild = client.guilds.resolve(guildId);
      if (!guild) {
        return [];
      }

      const members = await guild.members.fetch();
      return members
        .filter(member => !member.user.bot)
        .map(member => {
          return {
            id: member.id,
            name: member.nickname ?? member.displayName
          }
        });
    },

    sendMembersToVoiceChannels: async (guildId: string, channelMembers: VoiceChannelMembers[]): Promise<any> => {
      const guild = client.guilds.resolve(guildId);
      if (!guild) {
        return [];
      }

      for (const channel of channelMembers) {
        const voiceChannel = await guild.channels.fetch(channel.id);
        if (!voiceChannel || !voiceChannel.isVoice()) {
          continue;
        }

        for (const memberId of channel.memberIds) {
          const member = await guild.members.fetch(memberId);
          if (!member) {
            continue;
          }
          try {
            await member.voice.setChannel(channel.id);
          } catch (error) {
            console.error(`Error moving member to voice channel: ${error}`);
          }
        }
      }
    }
  };
};

export interface Guild {
  id: string;
  name: string;
};

export interface VoiceChannel {
  id: string;
  name: string;
}

export interface GuildMember {
  id: string;
  name: string;
}

export interface VoiceChannelMembers {
  id: string;
  memberIds: string[];
}