import { Message } from "discord.js";

import { LividaClient } from "../LividaClient";
import { EventListener } from "../structures/EventListener";

/**
 * Handles the message event.
 */
class MessageEvent extends EventListener<"message"> {
	constructor(readonly client: LividaClient) {
		super(client, { name: "message" });
	}

	emit(msg: Message) {
		if (msg.channel.type == "dm") return;
		let prefixes = this.client.ags.dev ? ["!!"] : ["l!", "1!"];

		// iterate over prefixes sequentially to prevent multiple
		for (const inp of prefixes) {
			let prefix = msg.content.match(/^<@!?${this.this.client.user.id}> /)
				? msg.content.match(/^<@!?${this.client.user.id}> /)[0]
				: msg.content.toLowerCase().startsWith(inp.toLowerCase())
				? inp
				: null;

			if (!prefix) {
				return;
			}

			let args = msg.content.replace(prefix, "").split(" ").slice(1),
				input = msg.content
					.replace(prefix, "")
					.split(" ")[0]
					.toLowerCase(),
				cmd =
					this.client.commands.get(input) ||
					this.client.aliases.get(input),
				member = this.client.guilds.cache
					.get(this.client.config.main_guild)
					.member(msg.author.id);

			if (
				!cmd ||
				(cmd.config.permissions.developer &&
					(!member ||
						!msg.member._roles.includes(
							this.client.config.roles.developer
						)))
			)
				return;

			try {
				await cmd.run(msg, args, prefix);
			} catch (e) {
				console.log(e);
				msg.reply(
					"an error occured while executing that command! Our development team have been notified."
				);
				this.client.channels.cache
					.get(this.client.config.channels.errors)
					.send({
						embed: {
							description: `${msg.author} | ${cmd.config.name}\n\n${e}`,
						},
					});
			}
		}
	}
}
