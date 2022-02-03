// Custom log to logs
const fs = require("fs");
const path = require("path");

class Out {
  /**
   * Get the default file path. Try not to override this.
   */
  static DefaultPath() {
    return path.join(__dirname, "..", "logs", `${Out.getStamp()}.log`);
  }

  /**
   * Get the file to log to: Can be ovverwritten using {@link Out.setFile} or {@link Out.setFileFunction}
   */
  static getFile() {
    return path.join(__dirname, "..", "logs", `${Out.getStamp()}.log`);
  }
  static dtf = "dd-mm-yyyy";

  /**
   * Set the file path to a string
   * @param {String} filePath The new file to save to
   */
  static async setFile(filePath) {
    Out.getFile = () => {
      return filePath;
    };
    await Out.info(`Set new file path to ${filePath}`);
    return this;
  }

  /**
   * Set the file path as a function of something... if you want that
   */
  static async setFileFunction(filePathFunction = () => {}) {
    Out.getFile = filePathFunction;
    await Out.info(
      `Set a new filepath function, returns ${filePathFunction()}`
    );
    return this;
  }

  /**
   *
   * @param {String} format dd-mm-yyyy | mm-dd-yyyy | yyy-dd-mm || yyyy-mm-dd (please try not to use slashes... it will give an error :/)
   */
  static setDateTimeFormat(format) {
    Out.dtf = index;
    return this;
  }

  constructor() {}

  /**
   * Get the current stamp for logging (use {@link Out.setDateTimeFormat} to change format)
   */
  static getStamp() {
    const date = new Date();
    const dtf = Out.dtf
      .replace("dd", date.getDate())
      .replace("mm", date.getMonth())
      .replace("yyyy", date.getFullYear());
    return dtf;
  }

  /**
   * Get the string to log. Uses the currently set date format (use {@link Out.setDateTimeFormat} to change)
   */
  static getString(...args) {
    let toLog = ``;
    args.forEach((arg) => {
      toLog += `\n[${Out.getStamp()}] ${arg}`;
    });
    return toLog;
  }

  static async info(...args) {
    const toLog = Out.getString(...args);
    const previous = await fs.readFileSync(Out.getFile(), {
      encoding: "utf-8",
    });
    fs.writeFileSync(Out.getFile(), previous + toLog, {
      encoding: "utf-8",
    });
    return this;
  }

  static async error(...args) {
    const allE = [];
    args.forEach((arg) => {
      allE.push(`(WARN) ` + arg);
    });
    await Out.info(...allE);
    return this;
  }

  static jsonify(object, space = 2) {
    return JSON.stringify(object, null, space);
  }
}

module.exports = Out;
