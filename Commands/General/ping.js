const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const { Command } = require("../Dev/$Command");

class Cmd extends Command {
	constructor() {
		super("Ping", "Pong!");
		this.useName = "Ping";
		this.description = "Pong!";
		this.cmdName = this.useName.toLowerCase();
		this.aliases = [];
		this.options = [];
		this.color = "RANDOM";
	}

	/**
	 * Call this command
	 * @param {Client} client
	 * @param {CommandInteraction} interaction Interaction to call upon
	 */
	async call(client, interaction) {
		await interaction.deferReply();
		const pingEmbed = new MessageEmbed()
			.setTitle("Pong!")
			.setDescription(`Ping: ${client.ws.ping} ms`)
			.setColor("RANDOM");
		await interaction.editReply({ embeds: [pingEmbed] });
	}
}

const command = new Cmd();

module.exports = command;
