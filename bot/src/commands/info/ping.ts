import { Message, MessageEmbed } from "discord.js";

import { LividaClient } from "../../LividaClient";
import { Command } from "../../structures/Command";

export class PingCommand extends Command {
	constructor(readonly client: LividaClient) {
		super(client, {
			name: "ping",
			aliases: [],
			category: "Information",
			usage: "",
			description: "Get the clients ping!",
			hidden: false,
			permissions: {
				developer: false,
			},
		});
	}

	async run(message: Message, args: string[]) {
		const msg = await message.channel.send(
			new MessageEmbed().setDescription("Fetching latency...")
		);

		const latency = msg.createdTimestamp - message.createdTimestamp;
		const embed = new MessageEmbed()
			.addField("**You ⇆ Discord:**", `${this.client.ws.ping}ms`, true)
			.addField("**Bot ⇆ Discord:**", `${latency}ms`, true)
			.setColor(
				this.client.ws.ping > 300 ||
					msg.createdTimestamp - message.createdTimestamp > 500
					? "RED"
					: this.client.ws.ping > 150 ||
					  msg.createdTimestamp - message.createdTimestamp > 300
					? "ORANGE"
					: "GREEN"
			);

		// update the message.
		await msg.edit(embed);
	}
}
