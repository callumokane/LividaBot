import { Message } from "discord.js";
import util from "util";

import { LividaClient } from "../../LividaClient";
import { Command } from "../../structures/Command";

export class EvaluateCommand extends Command {
	constructor(client: LividaClient) {
		super(client, {
			name: "evaluate",
			aliases: ["eval", "ev"],
			category: "Developer",
			usage: "",
			description: "Test JS expressions",
			hidden: false,
			permissions: {
				developer: true,
			},
		});
	}

	async run(message: Message, args: string[]) {
		let codein = args.join(" ");
		if (!args[0]) codein = "'No input given'";

		const msg = await message.channel.send(
			`**Input**\n\`\`\`js\n${codein}\`\`\``
		);

		let notoken = [
				"bot.token",
				"token",
				"client.token",
				"process.env.TOKEN",
			],
			nodel = [
				'require("fs").unlink("/")',
				"rm -rf",
				"rm *",
				"rm .",
				"rm",
			];
		if (nodel.includes(codein))
			return msg.edit(
				`${msg.content}\n**Output** (Error)\n\`\`\`You are not permitted to delete any files using evaluation!\`\`\``
			);
		if (notoken.includes(codein))
			return msg.edit(
				`${msg.content}\n**Output** (Error)\n\`\`\`You are not permitted to get the bots token using evaluation!\`\`\``
			);

		try {
			let code = await eval(codein),
				type =
					code && code.constructor
						? code.constructor.name
						: typeof code;

			if (code && code.constructor?.name == "Promise") code = await code;
			if (typeof code !== "string")
				code = util.inspect(code, { depth: 0 });

			code = code
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203));

			await msg.edit(
				`${msg.content}\n**Output** (${type})\n\`\`\`js\n${code}\`\`\``
			);
		} catch (e) {
			await msg.edit(
				`${msg.content}\n**Output** (Error)\n\`\`\`${e}\`\`\``
			);
		}
	}
}
