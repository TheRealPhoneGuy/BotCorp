const { Events, GuildMember, Client } = require("discord.js");
const colors = require("colors");

module.exports = {
  name: Events.GuildMemberAdd,

  /**
   *
   * @param {Client} client
   * @param {GuildMember} member
   */
  async run(client, member) {
    try {
      console.log(member);

      const channel = member.guild.channels.cache.get("1365744417595723889");

      channel.send(`
        <:fleche_droite:1328460868425351210> **Un ${member} sauvage** vient __d'arriver__ sur la __DisCorp__ ! <:DisCorpLogo:1364959464150532207>

- <:decouverte:1357836737350733886> ***Besoin d'aide ?*** __Va lire les__ <#1357838330611630146>  __ou fais un__ <#1358024899545006206> ! <:Rocket:1341476644153462804>`);
    } catch (err) {
      console.log(err);
    }
  },
};
