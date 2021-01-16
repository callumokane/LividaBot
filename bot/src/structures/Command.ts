import { Message } from "discord.js";

import { LividaClient } from "../LividaClient";

interface CommandOptions {
	name: string;
	aliases: string[];
	category: string;
	usage: string;
	description: string;
	hidden: boolean;
	permissions: Record<"developer", boolean>;
}

/**
 * Represents the base command class.
 */
export class Command {
	constructor(
		readonly client: LividaClient,
		readonly options: CommandOptions
	) {}

	/**
	 * Execute this command.
	 * @param message
	 * @param args
	 */
	async run(message: Message, args: string[]) {}
}

/**
 * Represents the constructor type of an extended command.
 */
export type ExtendedCommandConstructor = new (client: LividaClient) => Command;
