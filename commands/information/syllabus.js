const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

function sendEmbed(title, oh, ta, fields, avatarURL) {
    var updateEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(title)
        .addFields([{ name: `TA: ` + ta, value: `OH: ` + oh }])
        .setFooter({ iconURL: avatarURL, text: "Schedule" })
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/2693/2693710.png");
    fields.forEach(field => {
        var item = field.Item;
        var description = field.Description || "n/a";
        var weight = field.Weight;
        var date = field.Date;
        updateEmbed.setDescription(description)
        updateEmbed.addFields([{ name: item, value: `${date}\n\`${weight}\``, inline: true }])
    })
    return updateEmbed;
}

module.exports = {
    cooldown: 5,
    folder: "information",
    data: new SlashCommandBuilder()
        .setName('syllabus')
        .setDescription('Retrieve the syllabus or grading system for a given course')
        .addStringOption(option =>
            option.setName("course")
                .setDescription("The course to retrieve the information for")
                .setRequired(true)
                .addChoices(
                    { name: 'Mat322', value: 'mat322' },
                    { name: 'Lin204', value: 'lin204' },
                    { name: 'Ant102', value: 'ant102' },
                    { name: 'Soc100', value: 'soc100' }
                )),

    async execute(interaction) {
        var course = interaction.options.getString("course");

        const fs = require("fs");
        var syllabus = JSON.parse(fs.readFileSync("./syllabus.json", "utf8")) || {};

        var data = syllabus[course];

        var events = data.grading;

        var url = interaction.client.user.displayAvatarURL();

        interaction.reply({ embeds: [sendEmbed(`**${course}**\n` + data.day, data.OH, data.TA, events, url)], ephemeral: true })
    },
};