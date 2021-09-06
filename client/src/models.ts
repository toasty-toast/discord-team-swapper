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