const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('resources')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDescription('resources'),
	async execute(interaction) {
        var thumbnailURL = interaction.client.user.displayAvatarURL(); 
        const embed = new EmbedBuilder()
            .setColor("DarkGold")
            .addFields(
                { name: "Overall Drive", value: "[Link](https://drive.google.com/drive/folders/13-J30b81UfVQwYIHyCsSHHRpbVPjYa6f?usp=sharing)" },
                { name: "ARD Resources", value: "[Link](https://drive.google.com/drive/folders/1Ao6m7aWrfx6Tt-ZnNZVnIJcu8UZvL4g1?usp=drive_link)" },
                { name: "Crisis and Emergency response", value: "[Link](https://drive.google.com/drive/folders/1eUEBf1V6nAdxuez2mNU799g7J_VkiQSp?usp=drive_link)" },
                { name: "Programming and Community Development", value: "[Link](https://drive.google.com/drive/folders/1pdmEq47_QvvJXDh2Sglnpc7vF4awTHez?usp=drive_link)" },
                { name: "Residential Life 101", value: "[Link](https://drive.google.com/drive/folders/1t_SwmKBC2gxC8zqDAro4CRpr_cAB91DO?usp=drive_link)" },
                { name: "Staff Specific Information", value: "[Link](https://drive.google.com/drive/folders/1x0jYwbOWaGbl2K6t5D6TxaGoF0ctbpNz?usp=drive_link)" },
                { name: "Supervision", value: "[Link](https://drive.google.com/drive/folders/1RfZ0GOZ8qbBIUVuPi9gT90v3btHiWmLo?usp=drive_link)" },
                { name: "Training Information", value: "[Link](https://drive.google.com/drive/folders/1xpLdMCi61UpHWMA9htCkVflKZPLwLmEs?usp=drive_link)" }
            )
            .setThumbnail(thumbnailURL)
            .setTimestamp();
	
		await interaction.reply({embeds: [embed]})
	},
};