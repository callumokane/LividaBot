import { LividaApi } from "../LividaApi";
import { info } from "./servers";
import { stats } from "./stats";

/**
 * Register API routes.
 * @param server R
 */
export const registerRoutes = (server: LividaApi) => {
	server.app.use("/stats", stats).use("/servers", info);

	// default 404 handler for all request methods
	server.app.use("*", (req, res) =>
		res.status(404).json({ code: 404, msg: "endpoint not found" })
	);
};
