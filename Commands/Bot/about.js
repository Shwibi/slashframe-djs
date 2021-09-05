const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const { Command } = require("../Dev/$Command");
const { invite_link, support_server, Dev } = require("../../Core/config.json");

class About extends Command {
	constructor() {
		super("about");
		this.useName = "About";
		this.description = "More information about the bot!";
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
	async call(client, interaction) {
		await interaction.deferReply();

		const Embed = new MessageEmbed()
			.setAuthor(client.user.tag, client.user.avatarURL({ dynamic: true }))
			.setTitle("About me")
			.setDescription("Add description here")
			.addField("Devs", `<@${Dev.dev_ids.join(">, <@")}>`, true)
			.addField(
				`Support`,
				`[Support server](${support_server}) \n[Invite link](${invite_link})`,
				true
			)
			.setColor(this.color || "RANDOM")
			.setTimestamp();
		await interaction.editReply({ embeds: [Embed] });
	}
}
const about = new About();
module.exports = about;
