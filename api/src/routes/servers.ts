import { Router } from "express";

import { RHF } from "./types";

export const info: RHF = (server) =>
	Router().get("/:id?", (req, res) => {
		const server =
			client.guilds.cache.get(req.params.id) ||
			client.guilds.cache.get(client.config.main_guild);

		res.json({
			name: server.name,
			member_count: server.memberCount,
			cached_members: server.members.cache,
			channels: server.channels.cache,
			roles: server.roles.cache,
		});
	});
