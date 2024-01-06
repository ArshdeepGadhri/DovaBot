const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    cooldown: 5,
    folder: "features",
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
                .addStringOption(option => option.setName("optiontwo").setDescription("Second option").setRequired(true))
                .addStringOption(option => option.setName("optionthree").setDescription("Third option").setRequired(false))
                .addStringOption(option => option.setName("optionfour").setDescription("Fourth option").setRequired(false))
                .addStringOption(option => option.setName("optionfive").setDescription("Fifth option").setRequired(false))),
/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
    async execute(interaction) {
        const question = interaction.options.getString("question")

        var optionOne = "Yes"
        var optionTwo = "No"
        var optionThree, optionFour, optionFive;
        if (interaction.options.getSubcommand() === 'custom') {
            optionOne = interaction.options.getString("optionone") || optionOne;
            optionTwo = interaction.options.getString("optiontwo") || optionTwo;
            optionThree = interaction.options.getString("optionthree") || null;
            optionFour = interaction.options.getString("optionfour") || null;
            optionFive = interaction.options.getString("optionfive") || null;
        }

        const pollEmbed = new EmbedBuilder()
            .setDescription(`**${question}**`)
            .addFields([
                { name: optionOne, value: "0", inline: true },
                { name: optionTwo, value: "0", inline: true }
            ])
            .setTimestamp()
            .setThumbnail("https://cdn.icon-icons.com/icons2/3198/PNG/512/poll_icon_195220.png")
            .setColor('Aqua');

        if (optionThree) {
            pollEmbed.addFields([{ name: optionThree, value: "0", inline: true }])
        }
        if (optionFour) {
            pollEmbed.addFields([{ name: optionFour, value: "0", inline: true }])
        }
        if (optionFive) {
            pollEmbed.addFields([{ name: optionFive, value: "0", inline: true }])
        }

        const replyObject = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        const pollButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(optionOne)
                    .setCustomId(`Poll-Yes-${replyObject.id}`)
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel(optionTwo)
                    .setCustomId(`Poll-No-${replyObject.id}`)
                    .setStyle(ButtonStyle.Success)
            )

        if (optionThree) {
            pollButtons.addComponents(
                new ButtonBuilder()
                .setLabel(optionThree)
                .setCustomId(`Poll-Maybe-${replyObject.id}`)
                .setStyle(ButtonStyle.Success)
            )
        }
        if (optionFour) {
            pollButtons.addComponents(
                new ButtonBuilder()
                .setLabel(optionFour)
                .setCustomId(`Poll-Four-${replyObject.id}`)
                .setStyle(ButtonStyle.Success)
            )
        }
        if (optionFive) {
            pollButtons.addComponents(
                new ButtonBuilder()
                .setLabel(optionFive)
                .setCustomId(`Poll-Five-${replyObject.id}`)
                .setStyle(ButtonStyle.Success)
            )
        }

        interaction.editReply({ components: [pollButtons] })
    }

}