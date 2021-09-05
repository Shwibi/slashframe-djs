const { Client, CommandInteraction } = require("discord.js");
const { Command } = require("../Dev/$Command");

class MyCommand extends Command {
	constructor() {
		super("$CommandName");
		this.useName = "Cmd";
		this.description = "Cmd!";
		this.cmdName = this.useName.toLowerCase();
		this.aliases = [];
		this.options = [];
		this.color = "RANDOM";
	}

	/**
	 *
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	async call(client, interaction) {}
}
const myCommand = new MyCommand();
module.exports = myCommand;
