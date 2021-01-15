interface Command {
	config: {
		name: string;
		aliases: string[];
		category: string;
		usage: string;
		description: string;
		hidden: boolean;
		permissions: Record<"Developer", boolean>;
	};
	run: (client, message, args) => void;
}
