const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	cooldown: 5,
    folder: "information",
	data: new SlashCommandBuilder()
		.setName('notes')
		.setDescription('Retrieve google doc notes links for courses'),
	async execute(interaction) {
        var thumbnailURL = interaction.client.user.displayAvatarURL(); 
        const embed = new EmbedBuilder()
            .setColor("DarkGold")
            .addFields(
                { name: "Ant102", value: "[Link](https://docs.google.com/document/d/1qbrmVxZH0HZTGBGf5Y1Zmeu7iSpPuEE0CgJbImxUwL0/edit)" },
                { name: "Soc100", value: "[Link](https://docs.google.com/document/d/13wPbjZ_BR96A1urbYCLb9ZjV20l_4yvJxclaFBhGcxs/edit)" },
                { name: "Lin204", value: "[Link](https://docs.google.com/document/d/1dhXn957HT3f1_bUlZPUgUYip3jYVO2sgiuQXkdUMOaY/edit)" },
                { name: "Mat322", value: "[Link](https://docs.google.com/document/d/1_dCOO__Pr_tuoryLOvPMkMZuqV-Ng2ARc5kRPcm-nWM/edit)" },
                { name: "Csc369", value: "[Link](https://docs.google.com/document/d/1kFiQ6PQftz3S4dCuyH9MH0p4HruVPBx0uqHOtT7lUDc/edit)" }
            )
            .setThumbnail(thumbnailURL)
            .setTimestamp();
	
		await interaction.reply({embeds: [embed]})
	},
};