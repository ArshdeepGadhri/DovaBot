const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName('newsletter')
    .setDescription('Retrieve newsletter')
    .setDMPermission(true);

module.exports = {
    cooldown: 5,
    folder: "features",
    data: data,
    async execute(interaction) {
        const member = await interaction.member;

        const newsletterFile = process.env.NEWS_LETTER_FILE;
        const file = new AttachmentBuilder(`${newsletterFile}`);
        
        member.user.send({ content: "Here is your newsletter", files: [file] }).catch(
            (err) => {
                interaction.editReply(
                    {
                        content: "Unfortunately you do not have DM's enabled! To receieve the newsletter please go into your privacy secttings and enable 'Allow Direct Messages from Server Members'",
                        ephemeral: true
                    }
                )

                console.log(err);
                return
            }
            
        );


        interaction.reply({ content: "Check your DMs", ephemeral: true });
    },
};