/**
 * Capitalize the first character of the given string.
 * @param input
 */
export const upperOne = (input: string) => {
	return input.toLowerCase().charAt(0).toUpperCase() + input.substring(1);
};
