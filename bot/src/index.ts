import env from "dotenv";

import { HelpCommand } from "./commands/info/commands";
import { PingCommand } from "./commands/info/ping";
import { LividaClient } from "./LividaClient";

// load environment configuration
env.config();

const client = new LividaClient().addCommand(PingCommand, HelpCommand);
client.login();
