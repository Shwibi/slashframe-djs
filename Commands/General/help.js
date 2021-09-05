const {
	Client,
	CommandInteraction,
	MessageEmbed,
	Collection,
} = require("discord.js");
const { Command } = require("../Dev/$Command");

// Load commands into a new discord collection
const fs = require("fs");
const path = require("path");
const Commands = new Collection();
const All = {};

/**
 *
 * @param {Command} cmd
 */
function add(cmd) {
	Commands.set(cmd.name, cmd);
}

// Loop through commands folder
const commandFolders = fs.readdirSync(
	path.join(__dirname, "..", "..", "Commands")
);
for (const commandFolder of commandFolders) {
	All[commandFolder] = [];
	// Got all the categories, now loop through command files
	const commandFiles = fs
		.readdirSync(path.join(__dirname, "..", "..", "Commands", commandFolder))
		.filter(
			(file) =>
				!file.startsWith("$") && file.endsWith(".js") && !file.includes("help")
		);

	// Now loop through all files and set them in collection
	for (const file of commandFiles) {
		const command = require(path.join(
			__dirname,
			"..",
			"..",
			"Commands",
			commandFolder,
			file
		));
		add(command);
		All[commandFolder].push(command);
	}
}

class MyCommand extends Command {
	constructor() {
		super("help");
		this.useName = "Help";
		this.description = "Get help with the bot!";
		this.cmdName = this.useName.toLowerCase();
		this.aliases = [];
		this.options = [
			{
				type: "string",
				name: "command",
				description: "The command to get help with, if any",
				required: false,
			},
		];
		this.color = "RANDOM";
	}

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	async call(client, interaction) {
		await interaction.deferReply({ ephemeral: false });

		const cmd = interaction.options.get("command");

		if (cmd) {
			// Getting help with a particular command
			const command = Commands.find((c) => c.match(cmd.value));

			if (!command)
				return interaction.editReply({
					content: "That command does not exist or does not need any help!",
				});

			// Create command Embed
			const commandEmbed = this.createEmbed(command);
			await interaction.editReply({ embeds: [commandEmbed] });
			return;
		}

		// Entire help command
		const helpEmbed = new MessageEmbed()
			.setTitle(`Help is here!`)
			.setAuthor(client.user.username, client.user.avatarURL({ dynamic: true }))
			.setColor(this.color || "RANDOM")
			.setTimestamp();
		for (const cat in All) {
			const commandsInCat = All[cat];
			const array = [];
			commandsInCat.forEach((cmd) => {
				array.push(`${cmd.useName}: ${cmd.description}`);
			});
			helpEmbed.addField(
				cat,
				array.length > 0 ? array.join(", \n") : "No commands yet"
			);
		}
		await interaction.editReply({ embeds: [helpEmbed] });
	}

	/**
	 *
	 * @param {Command} cmd
	 */
	createEmbed(cmd) {
		const cmdOptArray = [];
		cmd.options.forEach((opt) => {
			cmdOptArray.push(
				`**${opt.name}**: ${opt.description} ${opt.required ? " - [req]" : ""} `
			);
		});
		return new MessageEmbed()
			.setTitle(cmd.useName)
			.setDescription(cmd.description)
			.setColor(cmd.color || "RANDOM")
			.setTimestamp()
			.addField(
				"Aliases",
				cmd.aliases.length > 0 ? cmd.aliases.join(", ") : "No Aliases",
				true
			)
			.addField(
				"Options",
				cmdOptArray.length > 0 ? cmdOptArray.join(", \n") : "No options",
				true
			);
	}
}
const myCommand = new MyCommand();
module.exports = myCommand;
