import { LividaClient } from "../LividaClient";
import { ClientEvents } from "../types/discord";

interface EventListenerOptions<Event> {
	name: Event;
}

/**
 * Represents a generic event listener.
 */
export abstract class EventListener<Event extends keyof ClientEvents> {
	constructor(
		readonly client: LividaClient,
		readonly options: EventListenerOptions<Event>
	) {}

	/**
	 * Return a reference to the client's logger.
	 */
	get logger() {
		return this.client.logger;
	}

	/**
	 * Emit this event, calling the given callback.
	 * @param args
	 */
	abstract emit(...args: ClientEvents[Event]): any;
}
