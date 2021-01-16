import { Message } from "discord.js";

import { LividaClient } from "../../LividaClient";
import { Command } from "../../structures/Command.js";

/**
 * Informs users of the currently playing song.
 */
class NowPlayingCommand extends Command {
	constructor(readonly client: LividaClient) {
		super(client, {
			name: "nowplaying",
			aliases: ["stats", "onair", "currentsong", "statistics", "np"],
			category: "Radio",
			usage: "",
			description: "View the current song on Livida Radio!",
			hidden: false,
			permissions: {
				developer: false,
			},
		});
	}

	run(message: Message, args: string[]) {
		message.channel.send(
			new MessageAttachment(client.nowPlaying, "nowplaying.png")
		);
	}
}
