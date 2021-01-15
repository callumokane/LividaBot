import chalk from "chalk";
import { Client, ClientOptions, Collection } from "discord.js";
import env from "dotenv";
import minimist, { ParsedArgs } from "minimist";
import { Db } from "mongodb";
import { connect } from "mongoose";

import { createLogger } from "@livida/shared";

import { CATEGORIES, EMOJI } from "./constants";
import Handlers from "./util/client/Handlers";
import Functions from "./util/functions";

env.config();

interface LividiaClientOptions extends ClientOptions {
	debug: boolean;
	databaseUri: string;
}

const DEFAULT_CLIENT_OPTIONS: LividiaClientOptions = {
	debug: false,
	databaseUri: "mongodb://localhost:27017/livida",
};

export class LividiaClient extends Client {
	readonly logger = createLogger();
	readonly options = DEFAULT_CLIENT_OPTIONS;

	commandCategories = CATEGORIES.filter((x) => !x.hidden).map((x) => x.name);

	events: Collection<any, any>;
	commands: Collection<any, any>;
	aliases: Collection<any, any>;

	/**
	 * Developer IDs.
	 */
	private devs = ["506899274748133376", "264617372227338241"];

	constructor(options: Partial<LividiaClientOptions>) {
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

	// Make login private - shouldn't be used.
	private login = super.login;

	async start() {
		await this.setupDatabase();

		this.Handlers = new Handlers(this);
		this.Handlers.loadEvents(this);
		this.Handlers.loadCommands(this);

		this.logger.info(`Loaded commands (${this.commands.size})`);
		this.logger.info(`Loaded events (${this.events.size})`);

		await this.login(
			this.ags.dev ? process.env.TOKENDEV : process.env.TOKEN
		)
			.then((_) => (this.db = require("../../index").db))
			.catch(this.error);
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
