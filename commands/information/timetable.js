const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	folder: "information",
	data: new SlashCommandBuilder()
		.setName('timetable')
		.setDescription('Get the timetable'),
	async execute(interaction) {
        const timetableFile = process.env.TIMETABLE_FILE;  
        const file = new AttachmentBuilder(`./${timetableFile}`);
        interaction.reply({content: "Here is your timetable", files: [file], ephemeral: true})
	},
};