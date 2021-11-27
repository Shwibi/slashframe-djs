require("dotenv").config();
// Import necessary objects/classes
const {
  SlashCommandBuilder,
  SlashCommandUserOption,
  SlashCommandRoleOption,
  SlashCommandChannelOption,
  SlashCommandStringOption,
  SlashCommandIntegerOption,
  SlashCommandNumberOption,
  SlashCommandBooleanOption,
} = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Command } = require("../Commands/Dev/$Command");
// const path = require("path");
// path.join(__dirname, "..", "Core", "config.json")
const { client_id, Dev } = require("../Core/config.json");
const token = process.env.TOKEN;

// Loaded commands
const commandCollection = require("./LoadCommands");

// Array of commands
const commandsArray = [];

/**
 *
 * @param {Command} cmd
 */
function build(cmd) {
  const slashCmd = new SlashCommandBuilder()
    .setName(cmd.cmdName)
    .setDescription(cmd.description)
    .setDefaultPermission(true);
  cmd.options.forEach((opt) => {
    switch (opt.type) {
      case "user":
        slashCmd.addUserOption(
          new SlashCommandUserOption()
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required)
        );
        break;
      case "role":
        slashCmd.addRoleOption(
          new SlashCommandRoleOption()
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required)
        );
        break;
      case "channel":
        slashCmd.addChannelOption(
          new SlashCommandChannelOption()
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required)
        );
        break;
      case "string":
        slashCmd.addStringOption(
          new SlashCommandStringOption()
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required)
        );
        break;
      case "integer":
        slashCmd.addIntegerOption(
          new SlashCommandIntegerOption()
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required)
        );
        break;
      case "number":
        slashCmd.addNumberOption(
          new SlashCommandNumberOption()
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required)
        );
        break;
      case "bool":
        slashCmd.addBooleanOption(
          new SlashCommandBooleanOption()
            .setName(opt.name)
            .setDescription(opt.description)
            .setRequired(opt.required)
        );
        break;
    }
  });

  return slashCmd;
}

commandCollection.forEach((cmd) => {
  commandsArray.push(build(cmd));
});

const JSONArray = commandsArray.map((c) => c.toJSON());
console.log(JSONArray);

const rest = new REST({ version: "9" }).setToken(token);

async function load() {
  try {
    const _argv = process.argv.slice(2).map((a) => a.trim().toLowerCase());
    if (_argv[0] == "global") {
      await rest.put(Routes.applicationCommands(client_id), {
        body: JSONArray,
      });
    } else {
      await rest.put(
        Routes.applicationGuildCommands(client_id, Dev.test_server_id),
        { body: JSONArray }
      );
    }

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
}

load();
