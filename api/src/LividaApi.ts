import express from "express";

interface LividaApiOptions {}

/**
 * The base API class.
 */
export class LividaApi {
	readonly app = express();

	constructor(readonly options: LividaApiOptions) {}
}
