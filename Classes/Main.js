const { Main } = require("shwi-js");

class MC extends Main {
  constructor(...name) {
    super(...name);
    this.config = require("../Core/config.json");
    this.redacted = this.config.Dev.redacted;

    this.err = {
      PERM: "You do not have enough permissions to use that!",
      WIP: "That feature is currently being worked on.",
      UNK: "An unknown error occured!",
      DEV: "That is a developer's feature, not out for public yet!",
      INV: "Please use the feature properly, look at help for better info!",
      INVC: "Invalid usage of command! Please use all the arguments properly!",
      INTERNALERR: "An internal error occured! Please notify a developer!",
    };

    this.allDevPing = this.joinUsers(...this.config.Dev.dev_ids);
    this.notifyDev = `Please notify any of the devs! ${this.allDevPing}`;
  }

  joinUsers(...ids) {
    return `<@${ids.join(">, <@")}>`;
  }
}

module.exports = MC;
