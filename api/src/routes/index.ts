import { LividaApi } from "../LividaApi";
import { info } from "./info";
import { stats } from "./stats";

/**
 * Register API routes.
 * @param server R
 */
export const registerRoutes = (server: LividaApi) => {
	server.app
		.use("/stats", stats)
		.use("/info", info)
		.get("/serverinfo", (req, res) => serverinfo(client, req, res))
		.get("/serverinfo/:serverID", (req, res) =>
			serverinfo(client, req, res)
		);

	// default 404 handler for all request methods
	server.app.use("*", (req, res) =>
		res.status(404).json({ code: 404, msg: "endpoint not found" })
	);

	server.app.listen(client.options._apiPort, () =>
		client.success(`API started on port ${client.options._apiPort}`)
	);
};
