const Evt = require("./$Event");
const { Client } = require("discord.js");

class Ready extends Evt {
	constructor() {
		super("ready");
	}
	/**
	 *
	 * @param {Client} client
	 */
	call(client) {
		console.log(`Logged in and online as ${client.user.tag}!`);
	}
}

module.exports = new Ready();
