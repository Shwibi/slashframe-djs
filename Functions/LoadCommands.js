// Load commands into a new discord collection
const { Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const Commands = new Collection();
const CommandClass = require("../Commands/Dev/$Command");

/**
 *
 * @param {CommandClass} cmd
 */
function add(cmd) {
	Commands.set(cmd.name, cmd);
}

// Loop through commands folder
const commandFolders = fs.readdirSync(path.join(__dirname, "..", "Commands"));
for (const commandFolder of commandFolders) {
	// Got all the categories, now loop through command files
	const commandFiles = fs
		.readdirSync(path.join(__dirname, "..", "Commands", commandFolder))
		.filter((file) => !file.startsWith("$") && file.endsWith(".js"));

	// Now loop through all files and set them in collection
	for (const file of commandFiles) {
		const command = require(path.join(
			__dirname,
			"..",
			"Commands",
			commandFolder,
			file
		));
		add(command);
	}
}

module.exports = Commands;
