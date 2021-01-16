import { RequestHandler } from "express";

import { LividaApi } from "../LividaApi";

/**
 * A generic request handler factory type.
 */
export type RHF = (server: LividaApi) => RequestHandler;
