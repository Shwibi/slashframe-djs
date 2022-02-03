require("dotenv").config();
// Import necessary objects/classes
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
// const path = require("path");
// path.join(__dirname, "..", "Core", "config.json")
const { client_id, Dev } = require("../Core/config.json");
const token = process.env.TOKEN;

const rest = new REST({ version: "9" }).setToken(token);

/**
 *
 * @param {[
 *  {
 *    id: "",
 *    application_id: "",
 *    version: "",
 *    default_permission: true,
 *    default_member_permissions: null,
 *    type: 1,
 *    name: "",
 *    description: "",
 *    guild_id: "",
 *    options: []
 *  }
 * ]} commandArray
 */
async function cmd(commandArray) {
  commandArray.forEach((command) => {
    const _argv = process.argv.slice(2).map((a) => a.toLowerCase());
    const stat = _argv.shift();
    if (_argv.length !== 0) {
      if (_argv[0] == "list_all_commands") {
        console.log({ command });
        return;
      }
      if (_argv.includes(command.name.toLowerCase())) {
        try {
          const deleteURL =
            stat == "dev"
              ? Routes.applicationGuildCommand(
                  client_id,
                  _argv[0] || Dev.test_server_id,
                  command.id
                )
              : Routes.applicationCommand(client_id, command.id);
          rest.get(deleteURL).then((fetchedCommand) => {
            rest.delete(deleteURL);
            console.log(`Deleted ${command.name} command (From ${stat}).`);
          });
        } catch (err) {
          if (err) console.error(err);
        }
      }
    }
  });
}

async function remove() {
  try {
    // await rest.put(
    // 	Routes.applicationGuildCommands(client_id, Dev.test_server_id),
    // 	{ body: JSONArray }
    // );
    const route =
      process.argv[2] == "dev"
        ? process.argv[3]
          ? Routes.applicationGuildCommands(client_id, process.argv[3])
          : Routes.applicationGuildCommands(client_id, Dev.test_server_id)
        : Routes.applicationCommands(client_id);

    await rest.get(route).then((result) => {
      cmd(result);
    });
  } catch (error) {
    console.error(error);
  }
}

remove();
