const Evt = require("./$Event");
const { Client, MessageEmbed } = require("discord.js");
const { Err } = require("shwi-js");

class Ready extends Evt {
  static FieldsTemp = [
    {
      name: "Field name",
      value: "Field value",
      inline: false,
    },
  ];

  constructor() {
    super("ready");
    this.once = true;
    this.toLog = [];
  }
  /**
   *
   * @param {Client} client
   */
  call(client) {
    console.log(`Logged in and online as ${client.user.tag}!`);
    client.user.setPresence({
      status: "idle",
      activities: [
        {
          name: "Study?",
          type: "PLAYING",
        },
        {
          name: "Studi studi",
          type: "WATCHING",
        },
      ],
    });

    this.handleLogs(client);
    this.log(`Client online as ${client.user.tag}.`, {
      non_embed: this.allDevPing,
      color: "GREEN",
      title: "Client online!",
      fields: [
        {
          name: "Platform",
          value: `${process.platform}`,
          inline: true,
        },
        {
          name: "Node",
          value: `${process.version}`,
          inline: true,
        },
        {
          name: "More info",
          value: `Args: ${process.argv.join(" + ")}`,
        },
      ],
    });
  }

  /**
   *
   * @param {Client} client
   */
  handleLogs(client) {
    const logs = this.config.Dev.logs;
    const logs_channel = client.channels.cache.get(logs);
    if (!logs_channel) return console.log(`Could not find logs channel!`);
    if (!this.logs_c) this.logs_c = logs_channel;
    // Error handling
    process.on("uncaughtException", (exception) => {
      const err = new Err(exception.message, exception.name, {
        exception,
      });
      this.log(err, {
        title: "An Error occured!",
        color: "RED",
        non_embed: this.allDevPing,
      });
      console.error(err);
    });

    // Redirect console logging
    const previousLog = console.log;
    this.prevLog = previousLog;
    const array = this.toLog;
    console.log = (...args) => {
      previousLog(...args);
      // Also add to array
      array.push(args);
    };
    this.toLog = array;
    console.log("Redirected console logging.");
    process.on("uncaughtException", (exception) => {
      this.clg(exception.stack);
    });
    setTimeout(() => {
      this.logCache();
    }, 5000);
  }

  logCache() {
    const toLog = this.toLog;
    // console.log("Logging cache.");
    if (toLog.length > 0) {
      this.log(toLog);
      this.toLog = [];
    }
    setTimeout(() => {
      this.logCache();
    }, 10000);
  }

  /**
   *
   * @param {String} details
   * @param {Error} error
   * @param {Ready.FieldsTemp} fields
   */
  errl(details, error, fields = Ready.FieldsTemp) {
    this.clg(details, {
      non_embed: this.allDevPing,
      color: "RED",
      title: "An Error occured!",
      fields: [{ name: "Trace", value: error.stack }, ...fields],
    });
  }

  clg(
    content,
    details = {
      non_embed: "Log",
      color: "RANDOM",
      title: "Log",
      fields: Ready.FieldsTemp,
    }
  ) {
    this.prevLog(content);
    this.log(content, details);
  }

  log(
    content,
    details = {
      non_embed: "Log",
      color: "RANDOM",
      title: "Log",
      fields: [
        {
          name: "Field name",
          value: "Field value",
          inline: false,
        },
      ],
    }
  ) {
    const { non_embed, color, title, fields } = details;
    let desc = JSON.stringify(content, null, 2);
    this.redacted.strings.forEach((str) => {
      desc = desc.replace(new RegExp(`${str}`, "gi"), "[redc]");
    });
    const sendEmbed = new MessageEmbed()
      .setTitle(title)
      .setColor(color)
      .setDescription(desc)
      .setTimestamp();

    if ((fields && fields[0]?.name !== "Field name") || fields?.length > 1) {
      let fields_t = [];
      fields.forEach((fld) => {
        this.redacted.strings.forEach((str) => {
          fld.name = fld.name.replace(new RegExp(`${str}`, "gi"), "[redc]");
          fld.value = fld.value.replace(new RegExp(`${str}`, "gi"), "[redc]");
        });
        fields_t.push(fld);
      });
      sendEmbed.addFields(fields_t);
    }
    this.logs_c.send({
      embeds: [sendEmbed],
      content: non_embed,
    });
  }
}
const ready = new Ready();
module.exports = ready;

// Global log
global.devlog = ready.log;
