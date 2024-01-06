const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    cooldown: 5,
    folder: "features",
    data: new SlashCommandBuilder()
        .setName("manypoll")
        .setDescription("Create a poll")
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
                .setName('options')
                .setDescription('Enter all options seperated by a comma')
                .addStringOption(option => option.setName("options").setDescription("Enter all options seperated by a comma").setRequired(true))),
/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
    async execute(interaction) {
        const options = interaction.options.getString("options")

        var allOptions = options.split(",");
        allOptions = allOptions.map(i => i.trim());
        var numOptions = allOptions.length;

        var fields = []
        numOptions.forEach(option => {
            fields.push({name: allOptions[option], value: `Vote ${option}`, inline: true})
        })

        const pollEmbed = new EmbedBuilder()
            .setDescription(`**Vote**`)
            .addFields(fields)
            .setTimestamp()
            .setThumbnail("https://cdn.icon-icons.com/icons2/3198/PNG/512/poll_icon_195220.png")
            .setColor('Aqua');

        const replyObject = await interaction.reply({ embeds: [pollEmbed], fetchReply: true });

        var reactions = ["1️⃣", "2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣"]
        reactions = reactions.slice(0, numOptions + 1);

        reactions.forEach(reaction => {
            replyObject.react(reaction)
        })

        // const pollButtons = new ActionRowBuilder()
        //     .addComponents(
        //         new ButtonBuilder()
        //             .setLabel(optionOne)
        //             .setCustomId(`Poll-Yes-${replyObject.id}`)
        //             .setStyle(ButtonStyle.Success),
        //         new ButtonBuilder()
        //             .setLabel(optionTwo)
        //             .setCustomId(`Poll-No-${replyObject.id}`)
        //             .setStyle(ButtonStyle.Success)
        //     )

        // interaction.editReply({ components: [pollButtons] })
    }

}