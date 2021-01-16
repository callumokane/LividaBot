import express from "express";
import { connect } from "mongoose";

import { createLogger } from "@livida/shared";

import { registerRoutes } from "./routes";

interface LividaApiOptions {
	databaseUri: string;
	port: number;
}

const DEFAULT_API_OPTIONS: LividaApiOptions = {
	port: 3000,
	databaseUri: "mongodb://localhost:27017/livida",
};

/**
 * The base API class.
 */
export class LividaApi {
	readonly app = express();
	readonly logger = createLogger();

	constructor(readonly options = DEFAULT_API_OPTIONS) {}

	/**
	 * Connect to MongoDB and set up the database.
	 */
	private async setupDatabase() {
		this.logger.info("Connecting to MongoDB...");
		await connect(this.options.databaseUri, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});
		this.logger.info("Connection successful");
	}

	async start() {
		await this.setupDatabase();

		registerRoutes(this);
		this.app.listen(this.options.port);
	}
}
