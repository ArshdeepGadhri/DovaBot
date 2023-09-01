const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName('newsletter')
    .setDescription('Retrieve newsletter')
    .setDMPermission(true);

module.exports = {
    
    cooldown: 5,
    data: data,
    async execute(interaction) {
        const member = await interaction.member;

        const newsletterFile = process.env.NEWS_LETTER_FILE;  
        const file = new AttachmentBuilder(`./${newsletterFile}`);
        member.user.send({content: "Here is your newsletter", files: [file]});
        interaction.reply({content: "Check your DMs", ephemeral: true});
    },
};