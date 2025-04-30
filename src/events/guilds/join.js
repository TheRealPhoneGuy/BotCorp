const { Events, GuildMember, Client, EmbedBuilder } = require("discord.js");
const colors = require("colors");

module.exports = {
  name: Events.GuildMemberAdd,

  /**
   * @param {Client} client
   * @param {GuildMember} member
   */
  async run(client, member) {
    try {
      console.log(`✅ L'événement GuildMemberAdd a été déclenché pour ${member.user.tag}`);

      const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);

      // Vérifier si le canal existe
      if (!channel) {
        console.log("❌ Le canal de bienvenue est introuvable ou non configuré.");
        return;
      }

      // Vérifier si le bot a les permissions nécessaires
      if (!channel.permissionsFor(member.guild.members.me).has("SendMessages")) {
        console.log("❌ Le bot n'a pas la permission d'envoyer des messages dans le canal de bienvenue.");
        return;
      }

      // Créer l'embed pour le message de bienvenue
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(`👋 Accueillons ${member.user.username} !`)
        .setDescription(`
           
          <:fleche_droite:1328460868425351210> **Un ${member.toString()} sauvage** vient __d'arriver__ sur la __DisCorp__ ! 

          - <:decouverte:1357836737350733886> ***Besoin d'aide ?*** __Va lire les__ <#1357838330611630146>  __ou fais un__ <#1358024899545006206> ! <:Rocket:1341476644153462804>
        `)

      // Envoyer l'embed dans le canal de bienvenue
      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error("❌ Une erreur est survenue dans l'événement GuildMemberAdd :", err);
    }
  },
};
