import { GuildChannel, TextChannel } from "discord.js";

import { LividaClient } from "../../LividaClient";
import { Command } from "../../structures/Command";

module.exports = {
	config: {},
	run: async (client, message, args) => {},
};

class BindCommand extends Command {
	constructor(readonly client: LividaClient) {
		super(client, {
			name: "bind",
			aliases: [],
			category: "Radio",
			usage: "",
			description: "Bind Livida Radio to a voice channel!",
			hidden: false,
			permissions: {
				developer: false,
			},
		});
	}

	async run(message: Message, args: string[]) {
		let coll = this.client.db.collection("bindings"),
			binded = await coll.findOne({ guildID: message.guild.id }),
			channel = this.client.getChannel<GuildChannel>(message, args[0]);

		if (!args[0])
			return message.reply(
				"please specify a channel to bind Livida radio too!"
			);
		if (!channel)
			return message.reply(
				"the specified channel was not found, please provide the name or ID of the voice channel!"
			);
		if (channel.type !== "voice")
			return message.reply(
				"the specified channel is not a voice channel, please provide the name or ID of a voice channel!"
			);
		if (binded && binded.id === channel.id)
			return message.reply("I am already bound to that channel!");

		coll.findOneAndUpdate(
			{ guildID: message.guild.id },
			{ $set: { channelID: channel.id } },
			{ upsert: true }
		);

		message.reply(
			binded
				? `Livida radio has been bounded to a new channel! \`${
						this.client.getChannel<TextChannel>(
							message,
							binded.channelID
						)!.name
				  }\` => \`${channel.name}\``
				: `you have successfully bound Livida radio to \`${channel.name}\``
		);
	}
}
