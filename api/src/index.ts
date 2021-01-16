import env from "dotenv";

import { LividaApi } from "./LividaApi";

// load environment configuration
env.config();

const api = new LividaApi();
api.start();
