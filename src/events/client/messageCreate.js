const { Events, ActivityType, Message } = require("discord.js");
const colors = require("colors");
const prefix = "!";

module.exports = {
  name: Events.MessageCreate,

  /**
   * @param {Message} message
   */
  async run(message) {
    try {
      switch (message.content) {
        case prefix + "hello":
          message.reply("Salut !");
          break;
      }
    } catch (err) {
      console.log(err);
    }
  },
};
