import { Router } from "express";

import { RHF } from "./types";

/**
 * Statistics endpoint.
 * @param server
 */
export const stats: RHF = (server) =>
	Router().get("/", async () => {
		let uptime1 = uptime();
		res.json({
			info: [
				{
					name: "Bot Uptime",
					value: uptime1,
				},
				{
					name: "Bot Websocket Latency",
					value: `${client.ws.ping}ms (Min:  ${
						client.minPing ? client.minPing + "ms" : "Unknown"
					}  / Max: ${
						client.maxPing ? client.maxPing + "ms" : "Unknown"
					})`,
				},
				{
					name: "Bot Message Latency",
					value: `Min: ${
						client.minMessageLatency
							? client.minMessageLatency + "ms"
							: "Unknown"
					} / Max: ${
						client.maxMessageLatency
							? client.maxMessageLatency + "ms"
							: "Unknown"
					}`,
				},
				{
					name: "Bot Memory Usage",
					value: (
						process.memoryUsage().heapUsed /
						1024 /
						1024
					).toFixed(2),
				},
			],
		});
	});
