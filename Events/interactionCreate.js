const Evt = require("./$Event");
const { Client, Interaction, CommandInteraction } = require("discord.js");
const cmds = require("../Functions/LoadCommands");
const { Command: CommandClass } = require("../Commands/Dev/$Command");

class IntCreate extends Evt {
	constructor() {
		super("interactionCreate");
	}

	/**
	 *
	 * @param {Client} client
	 * @param {Interaction} interaction
	 */
	call(client, interaction) {
		if (!this.client) this.client = client;

		// Get all commands
		if (!interaction.isCommand) return;
		this.cmdInt(interaction);
	}

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	cmdInt(interaction) {
		const cmd = cmds.find((c) => this.findCmd(c, interaction.commandName));
		if (cmd) this.callCmd(cmd, interaction);
	}

	/**
	 *
	 * @param {CommandClass} c
	 * @param {String} key
	 */
	findCmd(c, key) {
		return c.match(key);
	}

	/**
	 *
	 * @param {CommandClass} c
	 * @param {CommandInteraction} int
	 */
	callCmd(c, int) {
		c.call(this.client, int);
	}
}

module.exports = new IntCreate();
