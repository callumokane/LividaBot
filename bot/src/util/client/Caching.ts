import { LividaClient } from "../../LividaClient";

export class CacheManager {
	constructor(readonly client: LividaClient) {}

	updateCache() {
		this.client.users.cache.forEach((user) =>
			this.client.db
				.collection("cachedUsers")
				.findOneAndUpdate(
					{ id: user.id },
					{ $set: { cached: true } },
					{ upsert: true }
				)
		);
	}

	loadCache() {
		this.client.db
			.collection("cachedUsers")
			.find({ cached: true })
			.toArray()
			.then((cachedUsers) =>
				cachedUsers.forEach((cachedUser) =>
					client.users.fetch(cachedUser.id)
				)
			);
	}
}
