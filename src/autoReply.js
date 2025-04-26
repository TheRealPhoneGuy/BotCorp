module.exports = (client) => {
    client.on("messageCreate", (message) => {
      if (message.content === "!hello") {
        message.reply("Salut !");
      }
    });
  };
  