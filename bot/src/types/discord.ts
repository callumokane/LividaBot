import {
    Channel, Collection, Guild, GuildEmoji, GuildMember, Invite, Message, MessageReaction,
    PartialDMChannel, PartialGuildMember, PartialMessage, PartialUser, Presence, RateLimitData,
    Role, Snowflake, Speaking, TextChannel, User, VoiceState
} from "discord.js";

export interface ClientEvents {
	channelCreate: [Channel];
	channelDelete: [Channel | PartialDMChannel];
	channelPinsUpdate: [Channel | PartialDMChannel, Date];
	channelUpdate: [Channel, Channel];
	debug: [string];
	warn: [string];
	disconnect: [any, number];
	emojiCreate: [GuildEmoji];
	emojiDelete: [GuildEmoji];
	emojiUpdate: [GuildEmoji, GuildEmoji];
	error: [Error];
	guildBanAdd: [Guild, User];
	guildBanRemove: [Guild, User];
	guildCreate: [Guild];
	guildDelete: [Guild];
	guildUnavailable: [Guild];
	guildIntegrationsUpdate: [Guild];
	guildMemberAdd: [GuildMember];
	guildMemberAvailable: [GuildMember | PartialGuildMember];
	guildMemberRemove: [GuildMember | PartialGuildMember];
	guildMembersChunk: [
		Collection<Snowflake, GuildMember>,
		Guild,
		{ count: number; index: number; nonce: string | undefined }
	];
	guildMemberSpeaking: [GuildMember | PartialGuildMember, Readonly<Speaking>];
	guildMemberUpdate: [GuildMember | PartialGuildMember, GuildMember];
	guildUpdate: [Guild, Guild];
	inviteCreate: [Invite];
	inviteDelete: [Invite];
	message: [Message];
	messageDelete: [Message | PartialMessage];
	messageReactionRemoveAll: [Message | PartialMessage];
	messageReactionRemoveEmoji: [MessageReaction];
	messageDeleteBulk: [Collection<Snowflake, Message | PartialMessage>];
	messageReactionAdd: [MessageReaction, User | PartialUser];
	messageReactionRemove: [MessageReaction, User | PartialUser];
	messageUpdate: [Message | PartialMessage, Message | PartialMessage];
	presenceUpdate: [Presence | undefined, Presence];
	rateLimit: [RateLimitData];
	ready: [];
	invalidated: [];
	roleCreate: [Role];
	roleDelete: [Role];
	roleUpdate: [Role, Role];
	typingStart: [Channel | PartialDMChannel, User | PartialUser];
	userUpdate: [User | PartialUser, User];
	voiceStateUpdate: [VoiceState, VoiceState];
	webhookUpdate: [TextChannel];
	shardDisconnect: [CloseEvent, number];
	shardError: [Error, number];
	shardReady: [number, Set<Snowflake> | undefined];
	shardReconnecting: [number];
	shardResume: [number, number];
}
