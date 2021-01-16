import env from "dotenv";

import { LividaClient } from "./LividaClient";

// load environment configuration
env.config();

const client = new LividaClient();
client.login();
