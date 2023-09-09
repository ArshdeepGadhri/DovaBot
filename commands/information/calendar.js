const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	folder: "information",
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('Get the calendar'),
	async execute(interaction) {
        const calendarFile = process.env.CALENDAR_FILE;  
        const file = new AttachmentBuilder(`./${calendarFile}`);
        interaction.reply({content: "Here is your calendar", files: [file], ephemeral: true})
	},
};