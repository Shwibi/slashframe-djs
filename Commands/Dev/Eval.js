const { Client, CommandInteraction } = require("discord.js");
const ready = require("../../Events/ready");
const { Command } = require("../Dev/$Command");

const MAX_TIME = 10 * 60;

class EvalCommand extends Command {
  constructor() {
    super("Eval");
    this.useName = "eval";
    this.description = "Dev Eval";
    this.cmdName = this.useName.toLowerCase();
    this.aliases = [];
    this.options = [
      Command.CreateOpt(
        "integer",
        "time",
        "Time for collection, in seconds.",
        false
      ),
    ];
    this.color = "RANDOM";
  }

  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   */
  async call(client, interaction) {
    await interaction.deferReply({ ephemeral: true });

    // Get user
    const user = interaction.user;

    // Get dev
    if (!this.config.Dev.dev_ids.includes(user.id))
      return await interaction.editReply("No.");

    // Get options
    let time = interaction.options.get("time")?.value || 120;
    if (time > MAX_TIME) time = MAX_TIME;
    await interaction.editReply("Please send the content to eval!");
    const filter = (m) => m.author.id == interaction.user.id;
    // Listen for folow-up messages
    const messageCollector = interaction.channel.createMessageCollector({
      filter: filter,
      time: time * 1000,
      max: 10,
    });

    messageCollector.on("collect", (msg) => {
      console.log("Test!");

      const content = msg.content;

      // Parse content
      const parsedContent = this.parseEval(content);
      console.log({ parsedContent });
      try {
        eval(parsedContent);
      } catch (err) {
        if (err) {
          ready.clg(err, {
            non_embed: this.allDevPing,
            color: "#fc0330",
            title: `Error: ${this.ErrCodes.EVAL}`,
            fields: [{ name: "errl", value: err.stack || "no stack" }],
          });
        }
      } finally {
        interaction.followUp("Completed evaluation. Please check logs.");
      }
    });
  }

  /**
   *
   * @param {String} content
   */
  parseEval(content) {
    if (content.startsWith("```")) {
      const firstLine = content.indexOf("\n") + 1;
      const lastLine = content.lastIndexOf("\n");
      const parsedContent = content.slice(firstLine, lastLine);
      return parsedContent;
    } else return content;
  }
}
const evalCommand = new EvalCommand();
module.exports = evalCommand;
