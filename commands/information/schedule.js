const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

function sendEmbed(title, fields, avatarURL) {
    var updateEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(title)
        .setFooter({iconURL: avatarURL, text: "Schedule"})
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/2693/2693710.png");
    fields.forEach(field => {
        var desc = !field.Session.includes("Lunch") ? `📌: ${field.Location}\n🎤: ${field.Presenters}` : "🍜 \u200B"
        updateEmbed.addFields([{name: field.Session + " - " + field.Timings + "\n", value: desc, inline: false}, { name: '\u200B', value: ' ' }])
    })
    return updateEmbed;
}

module.exports = {
	cooldown: 5,
    folder: "information",
	data: new SlashCommandBuilder()
		.setName('schedule')
		.setDescription('Retrieve the schedule for a given day')
		.addStringOption(option =>
			option.setName('day')
				.setDescription('The day')
				.setRequired(true)
				.addChoices(
					{ name: 'Tuesday Sept 5', value: 'sept5' },
					{ name: 'Wednesday Sept 6', value: 'sept6' },
                    { name: 'Thursday Sept 7', value: 'sept7' },
                    { name: 'Friday Sept 8', value: 'sept8' },
                    { name: 'Monday Sept 11', value: 'sept11' },
                    { name: 'Tuesday Sept 12', value: 'sept12' },
                    { name: 'Wednesday Sept 13', value: 'sept13' },
                    { name: 'Thursday Sept 14', value: 'sept14' },
                    { name: 'Friday Sept 15', value: 'sept15' },
                    { name: 'Monday Sept 18', value: 'sept18' },
                    { name: 'Tuesday Sept 19', value: 'sept19' },
                    { name: 'Wednesday Sept 20', value: 'sept20' },
                    { name: 'Thursday Sept 21', value: 'sept21' },
                    { name: 'Friday Sept 22', value: 'sept22' },
				)),
	async execute(interaction) {
		var day = interaction.options.getString("day");

        const fs = require("fs");
        var schedule = JSON.parse(fs.readFileSync("./schedule.json", "utf8")) || {};
        var data = schedule[day];

        var events = data.events;
        var url = interaction.client.user.displayAvatarURL();

        interaction.reply({ embeds: [sendEmbed(data.day, events, url)], ephemeral: true })
	},
};