import { RequestHandler } from "express";

import { LividiaAPI } from "../LividiaAPI";

/**
 * A generic request handler factory type.
 */
export type RHF = (server: LividiaAPI) => RequestHandler;
