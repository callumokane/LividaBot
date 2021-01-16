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
export abstract class Command {
	constructor(
		readonly client: LividaClient,
		readonly options: CommandOptions
	) {}

	/**
	 * Return a reference to the client's logger.
	 */
	get logger() {
		return this.client.logger;
	}

	/**
	 * Execute this command.
	 * @param message
	 * @param args
	 */
	abstract run(message: Message, args: string[], prefix: string): any;
}

/**
 * Represents the constructor type of an extended command.
 */
export type ExtendedCommandConstructor = new (client: LividaClient) => Command;
