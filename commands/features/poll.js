const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a poll")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName("question")
                .setDescription("Poll question")
                .setRequired(true)),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const question = interaction.options.getString("question")

        const pollEmbed = new EmbedBuilder()
            .setDescription(`**Question**\n ${question}`)
            .addFields([
                { name: "Yes", value: "0", inline: true },
                { name: "No", value: "0", inline: true }
            ])
            .setColor('Aqua');

        const replyObject = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        const pollButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Yes")
                    .setCustomId(`Poll-Yes-${replyObject.id}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel("No")
                    .setCustomId(`Poll-No-${replyObject.id}`)
                    .setStyle(ButtonStyle.Danger)
            )

        interaction.editReply({ components: [pollButtons] })
    }

}