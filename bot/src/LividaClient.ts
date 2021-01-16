import { Client, ClientOptions, ClientUser, Collection, Message } from "discord.js";
import { connect } from "mongoose";

import { createLogger } from "@livida/shared";

import { CATEGORIES } from "./constants";
import { Command, ExtendedCommandConstructor } from "./structures/Command";

/**
 * Options the client can take.
 */
interface LividaClientOptions extends ClientOptions {
	debug: boolean;
	token: string;
	databaseUri: string;
}

/**
 * Contains the default options for the bot client.
 */
const DEFAULT_CLIENT_OPTIONS: LividaClientOptions = {
	debug: false,
	databaseUri: "mongodb://localhost:27017/livida",
	token: "",
};

/**
 * Bot client - extends from Discord.JS client to allow access to inherited methods.
 */
export class LividaClient extends Client {
	readonly logger = createLogger();
	readonly options = DEFAULT_CLIENT_OPTIONS;

	commandCategories = CATEGORIES.filter((x) => !x.hidden).map((x) => x.name);

	events = new Collection<any, any>();
	commands = new Collection<string, Command>();

	// aliases are part of commands - shouldn't be here.
	aliases = new Collection<any, any>();

	// client user will always exist when commands are executed.
	user!: ClientUser;

	constructor(options?: Partial<LividaClientOptions>) {
		super(options);
		this.options = { ...this.options, ...options };
	}

	/**
	 * Add commands to this client.
	 * @param commands
	 */
	addCommand(...commands: ExtendedCommandConstructor[]) {
		commands.forEach((v) => {
			const command = new v(this);
			this.commands.set(command.options.name, command);
		});
		return this;
	}

	private _categories: string[] | undefined;

	/**
	 * Return the categories of available commands.
	 */
	get categories() {
		if (this._categories) {
			return this._categories;
		}

		const categories = new Set<string>();
		this.commands.forEach((v) => categories.add(v.options.category));
		this._categories = Array.from(categories);

		return this._categories;
	}

	/**
	 * Connect to MongoDB and set up the database.
	 */
	async setupDatabase() {
		this.logger.info("Connecting to MongoDB...");
		await connect(this.options.databaseUri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
	}

	/**
	 * Connect to Discord and initialize the database.
	 * @param token The access token
	 */
	async login(token = this.options.token) {
		await this.setupDatabase();

		// this is bad. don't use fs to load shit.
		// this.Handlers = new Handlers(this);
		// this.Handlers.loadEvents(this);
		// this.Handlers.loadCommands(this);

		this.logger.info(`Loaded commands (${this.commands.size})`);
		this.logger.info(`Loaded events (${this.events.size})`);

		// use try-catch blocks
		try {
			await super.login(token);
		} catch (err) {
			this.logger.error(err);
		}

		return token;
	}

	/**
	 * Extract a target channel from a message.
	 * @param msg
	 * @param query
	 */
	getChannel(msg: Message, query: string) {
		if (query.length > 3)
			return (
				msg.mentions.channels.first() ||
				this.channels.cache.get(query) ||
				this.channels.cache
					.filter(
						(ch) =>
							(ch as any).name.includes(query.toLowerCase()) &&
							ch.type === "text"
					)
					.first()
			);
		else
			return (
				msg.mentions.channels.first() || this.channels.cache.get(query)
			);
	}
}
