/**
 * Copyright @Shwi 2021
 * Slash Commands framework made by Shwi
 * You can use this framework however you want, except distributing the exact copies commercially. You are free to make your own bot and use
 * it commercially.
 */

require("dotenv").config();

const Discord = require("discord.js");
const token = process.env.TOKEN;
const wait = require("util").promisify(setTimeout);

// Filesystem
const fs = require("fs");
const path = require("path");
const Event = require("./Events/$Event");

// Necessary discord.js classes
const { Client, Intents } = Discord;

// The new client; Our bot!
const client = new Client({
	intents: [Intents.FLAGS.GUILDS],
});

// Event Loader
/**
 * @param {Event} evt
 */
function Load(evt) {
	if (evt.once) {
		client.once(evt.evtName, (...args) => evt.call(...args));
	} else {
		client.on(evt.evtName, (...args) => evt.call(client, ...args));
	}
}

// Event handler
fs.readdir(path.join(__dirname, "Events"), "utf-8", (err, files) => {
	if (err) return console.error(err);
	files.forEach((file) => {
		if (!file.endsWith(".js") || file.startsWith("$")) return;

		const event = require(path.join(__dirname, "Events", file));
		Load(event);
	});
});

// Login with token
client.login(token);
global.client = client;
