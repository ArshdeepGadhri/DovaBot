const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Create a poll")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('default')
                .setDescription('Create a yes/no poll')
                .addStringOption(option => option.setName("question").setDescription("Poll question").setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('custom')
                .setDescription('Create a custom poll')
                .addStringOption(option => option.setName("question").setDescription("Poll question").setRequired(true))
                .addStringOption(option => option.setName("optionone").setDescription("First option").setRequired(true))
                .addStringOption(option => option.setName("optiontwo").setDescription("Second option").setRequired(true))),
/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
    async execute(interaction) {
        const question = interaction.options.getString("question")

        var optionOne = "Yes"
        var optionTwo = "No"
        if (interaction.options.getSubcommand() === 'custom') {
            optionOne = interaction.options.getString("optionone") || optionOne;
            optionTwo = interaction.options.getString("optiontwo") || optionTwo;
        }

        const pollEmbed = new EmbedBuilder()
            .setDescription(`**${question}**`)
            .addFields([
                { name: optionOne, value: "0", inline: true },
                { name: optionTwo, value: "0", inline: true }
            ])
            .setTimestamp()
            .setThumbnail("https://w7.pngwing.com/pngs/842/509/png-transparent-opinion-polling-on-the-donald-trump-administration-poll-everywhere-social-polling-youtube-youtube-text-trademark-rectangle-thumbnail.png")
            .setColor('Aqua');

        const replyObject = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        const pollButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(optionOne)
                    .setCustomId(`Poll-Yes-${replyObject.id}`)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel(optionTwo)
                    .setCustomId(`Poll-No-${replyObject.id}`)
                    .setStyle(ButtonStyle.Secondary)
            )

        interaction.editReply({ components: [pollButtons] })
    }

}