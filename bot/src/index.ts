import env from "dotenv";

import { EvaluateCommand } from "./commands/developer/evaluate";
import { HelpCommand } from "./commands/info/commands";
import { PingCommand } from "./commands/info/ping";
import { LividaClient } from "./LividaClient";

// load environment configuration
env.config();

const client = new LividaClient({
	token: process.env.TOKEN,
}).addCommand(PingCommand, EvaluateCommand);

client.login();
