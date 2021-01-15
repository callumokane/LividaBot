import { createLogger as winston, format, transports } from "winston";

const { combine, label, timestamp, colorize, simple } = format;

/**
 * Create a lnew winston logger.
 */
export const createLogger = () =>
	winston({
		transports: [new transports.Console()],
		format: combine(timestamp(), colorize(), simple()),
	});
