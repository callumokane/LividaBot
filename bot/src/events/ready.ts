import { LividaClient } from "../LividaClient";
import { EventListener } from "../structures/EventListener";

/**
 * Handles the ready event.
 */
class ReadyEvent extends EventListener<"ready"> {
	constructor(readonly client: LividaClient) {
		super(client, { name: "ready" });
	}

	emit() {
		this.logger.info(`Connected as ${this.client.user.tag}`);

		// setInterval(() => cache.updateCache(client), 15000);
		// setInterval(() => {
		// 	if (!client.maxPing || client.maxPing < client.ws.ping)
		// 		client.maxPing = client.ws.ping;
		// 	if (!client.minPing || client.minPing > client.ws.ping)
		// 		client.minPing = client.ws.ping;
		// }, 2000);

		// api.loadAPI(client);
		// cache.loadCache(client);
		// cache.updateCache(client);
	}
}
