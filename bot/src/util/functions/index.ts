import axios from "axios";
import { Client, MessageEmbed } from "discord.js";

import regenCanvas from "./regenCanvas";

export default class Functions extends Client {
	Embed: unknown | MessageEmbed;
	constructor(client) {
		super(client);
		this.Embed = MessageEmbed;
		client.fetch = (url: string, options?: object) =>
			axios(url, options).catch((e) =>
				console.log(`${client.chalk.orange(` AXIOS `)} ${e}`)
			);

		setInterval(() => regenCanvas(client).catch(null), 5000);
	}

	getCommand(cmd: string) {
		const client = require(process.cwd() + "/dist/index").Bot;
		const cm =
			client.aliases.get(cmd.toLowerCase()) ||
			client.commands.get(cmd.toLowerCase());
		return cm || false;
	}

	requestSong(song: string, user: string) {
		const body = JSON.stringify({
			name: user,
			type: "Song Request",
			message: song,
			requestOrigin: "Discord",
		});

		axios("https://livida.net/api/radio/request", {
			method: "POST",
			data: body,
			headers: { "Content-Type": "application/json" },
		});
	}
}
