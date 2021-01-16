import { Message, MessageEmbed } from "discord.js";

import { LividaClient } from "../../LividaClient";
import { Command } from "../../structures/Command";
import { upperOne } from "../../util/methods";

module.exports = {
	config: {},
	run: (client, message, args, prefix) => {},
};
function commandEmbed(client, message, _, command, msg?, prefix?) {
	const embed = new this.client.Embed()
		.setAuthor(`${this.client.upperOne(command.config.name)}`)
		.setDescription(`\`\`\`yaml\n${command.config.description}\`\`\``)
		.addField("Category", this.client.config.category, true)
		.addField(
			"Aliases",
			command.config.aliases[0]
				? command.config.aliases.map((x) => `\`${x}\``).join(", ")
				: "None",
			true
		);
	if (command.config.usage.length > 2)
		embed.setFooter(
			`${prefix}${command.config.name} ${command.config.usage}`
		);
	msg
		? (() => {
				msg.edit(embed);
				msg.reactions.removeAll();
		  })()
		: message.channel.send(embed);
}

export class HelpCommand extends Command {
	constructor(readonly client: LividaClient) {
		super(client, {
			name: "commands",
			aliases: ["help", "cmds"],
			category: "Information",
			usage: "[Category|Command]",
			description: "View our bots available commands!",
			hidden: false,
			permissions: {
				developer: false,
			},
		});
	}

	/**
	 * Generate a category embed.
	 * @param message
	 * @param category
	 * @param msg
	 */
	createCategoryEmbed(message: Message, category: string, msg?: Message) {
		const embed = new MessageEmbed()
			.setAuthor(upperOne(category), this.client.user.avatarURL()!)
			.setDescription(
				this.client.commands
					.map((cmd) => `\`${cmd.options.name}\``)
					.join(", ")
			)
			.setFooter(
				`${this.client.commands.size} total commands in this category!`
			);

		// update the embed if target message given.
		if (msg && msg.author.id == this.client.user.id) {
			msg.edit(embed);
			msg.reactions.removeAll();
		} else {
			message.channel.send(embed);
		}
	}

	async run(message: Message, args: string[]) {
		const modules = [...new Set(this.client.commandCategories)],
			mAliases = [].concat.apply(
				[],
				this.client.categories.map((x) => x.aliases)
			);
		if (this.client.devs.includes(message.author.id))
			modules.push("Developer");
		if (!args[0]) {
			const embed = new this.client.Embed()
				.setAuthor(
					`${this.client.user.username} • Command Categories`,
					this.client.user.avatarURL
				)
				.setDescription(
					"Run `l!help [category|command]` for more information!"
				)
				.setFooter(
					`${this.client.commands.size} total commands - <required> [optional]`
				);
			modules.forEach((module) =>
				embed.addField(
					`${this.client.moduleEmoji[module as any]} **${module}**`,
					`${
						this.client.commands
							.filter((cmd) => cmd.config.category == module)
							.filter((x) =>
								modules.includes("Developer")
									? x == x
									: x.config.category !== "Developer"
							).size
					} Commands`,
					true
				)
			);
			message.channel.send(embed);
		} else if (
			modules
				.map((x) => (x as any).toLowerCase())
				.includes(args[0].toLowerCase()) &&
			this.client.commands.get(args[0].toLowerCase())
		) {
			let embed = new this.client.Embed().setDescription(
				`Both a command and category is named \`${args[0]}\`, which are you trying to view?\n\n:one: Command • :two: Category`
			);
			message.channel.send(embed).then((msg) => {
				msg.react(this.client.Constants.Emojis.Numbers.One).then(() => {
					msg.react(this.client.Constants.Emojis.Numbers.Two);
					const cmd = (reaction, user) =>
							reaction.emoji.name ==
								this.client.Constants.Emojis.Numbers.One &&
							user.id === message.author.id,
						cat = (reaction, user) =>
							reaction.emoji.name ==
								this.client.Constants.Emojis.Numbers.Two &&
							user.id === message.author.id,
						command = msg.createReactionCollector(cmd, {
							time: 1000000,
						}),
						category = msg.createReactionCollector(cat, {
							time: 1000000,
						});
					command.on("collect", () =>
						commandEmbed(
							client,
							message,
							args,
							this.client.getCommand(args[0]),
							msg
						)
					);
					category.on("collect", () =>
						categoryEmbed(
							client,
							message,
							args,
							this.client.commands.filter(
								(cmd) =>
									cmd.config.category.toLowerCase() ===
									args[0].toLowerCase()
							),
							args[0],
							msg
						)
					);
				});
			});
		} else if (
			mAliases.includes(args[0].toLowerCase()) &&
			this.client.aliases.get(args[0].toLowerCase())
		) {
			let embed = new this.client.Embed().setDescription(
				`Both a command and category have an alias called \`${args[0]}\`, which are you trying to view?\n\n:one: Command • :two: Category`
			);
			message.channel.send(embed).then((msg) => {
				msg.react(this.client.Constants.Emojis.Numbers.One).then(() => {
					msg.react(this.client.Constants.Emojis.Numbers.Two);
					const cmd = (reaction, user) =>
							reaction.emoji.name ==
								this.client.Constants.Emojis.Numbers.One &&
							user.id === message.author.id,
						cat = (reaction, user) =>
							reaction.emoji.name ==
								this.client.Constants.Emojis.Numbers.Two &&
							user.id === message.author.id,
						command = msg.createReactionCollector(cmd, {
							time: 1000000,
						}),
						category = msg.createReactionCollector(cat, {
							time: 1000000,
						});
					command.on("collect", () =>
						commandEmbed(
							client,
							message,
							args,
							this.client.getCommand(args[0]),
							msg,
							prefix
						)
					);
					category.on("collect", () =>
						categoryEmbed(
							client,
							message,
							args,
							this.client.commands.filter(
								(cmd) =>
									cmd.config.category.toLowerCase() ==
									this.client.Constants.commandCategories
										.filter((m) =>
											m.aliases.includes(
												args[0].toLowerCase()
											)
										)[0]
										.name.toLowerCase()
							),
							this.client.Constants.commandCategories.filter(
								(m) => m.aliases.includes(args[0].toLowerCase())
							)[0].name,
							msg
						)
					);
				});
			});
		} else if (
			modules
				.map((x) => (x as any).toLowerCase())
				.includes(args[0].toLowerCase())
		) {
			let commands = this.client.commands.filter(
				(cmd) =>
					cmd.config.category.toLowerCase() === args[0].toLowerCase()
			);
			categoryEmbed(client, message, args, commands, args[0]);
		} else if (mAliases.includes(args[0].toLowerCase())) {
			var cat = this.client.Constants.commandCategories.filter((m) =>
				m.aliases.includes(args[0].toLowerCase())
			)[0].name;
			let commands = this.client.commands.filter(
				(cmd) => cmd.config.category.toLowerCase() == cat.toLowerCase()
			);
			categoryEmbed(client, message, args, commands, cat);
		} else {
			var command = this.client.getCommand(args[0]);
			if (!command) {
				return message.channel.send({
					embed: {
						description:
							"The specified command or category was not found!",
					},
				});
			}
			commandEmbed(client, message, args, command, 0, prefix);
		}
	}
}
