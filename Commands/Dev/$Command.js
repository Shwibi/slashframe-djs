const { CommandInteraction, Client } = require("discord.js");
const MC = require("../../Classes/Main");

const CommandName = "CommandName";

class Command extends MC {
	constructor(
		cmdName = CommandName,
		description = "Description",
		aliases = [],
		options = []
	) {
		super("command", cmdName);
		this.useName = cmdName;
		this.description = "Description";
		this.cmdName = this.useName.toLowerCase();
		this.aliases = [];
		this.options = [
			{
				type: "user/channel/role/string/integer/number/bool",
				name: "name",
				description: "desc",
				required: false,
			},
		];
		this.color = "RANDOM";
	}

	/**
	 * Check if a keyword can be used to call this command
	 * @param {String} keyword
	 * @returns {Boolean}
	 */
	match(keyword, callback = (cmd) => {}) {
		if (this.cmdName == keyword || this.aliases.includes(keyword)) {
			callback(this);
			return true;
		} else return false;
	}

	/**
	 * Search
	 * @param {String} keyword
	 * @returns {Boolean}
	 */
	looseMatch(keyword, callback = (cmd) => {}) {
		let returner = false;
		if (this.match(keyword)) returner = true;
		if (this.cmdName.includes(keyword)) returner = true;
		this.aliases.forEach((al) => {
			if (al.includes(keyword)) returner = true;
		});
		if (returner) callback(this);
		return returner;
	}

	/**
	 * Call this command
	 * @param {Client} client
	 * @param {CommandInteraction} interaction Interaction to call upon
	 */
	async call(client, interaction) {}
}

const command = new Command();

module.exports = { command, Command };
