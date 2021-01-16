import { createLogger as winston, format, transports } from "winston";

const { combine, colorize, simple } = format;

/**
 * Create a lnew winston logger.
 */
export const createLogger = () =>
	winston({
		transports: [new transports.Console()],
		format: combine(colorize(), simple()),
	});
