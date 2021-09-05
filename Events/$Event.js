const MC = require("../Classes/Main");

class Event extends MC {
	constructor(name) {
		super("event", name);
		this.evtName = name;
		this.useName = name;
		this.once = false;
	}

	call(client, args) {}
}

module.exports = Event;
