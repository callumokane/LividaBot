import { Client, ClientOptions, Collection } from "discord.js";
import { connect } from "mongoose";

import { createLogger } from "@livida/shared";

import { CATEGORIES } from "./constants";
import Handlers from "./util/client/Handlers";

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
	commands = new Collection<any, any>();

	// aliases are part of commands - shouldn't be here.
	aliases = new Collection<any, any>();

	constructor(options?: Partial<LividaClientOptions>) {
		super(options);
		this.options = { ...this.options, ...options };
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
	getChannel(msg: Message, query) {
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
