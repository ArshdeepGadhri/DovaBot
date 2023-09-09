const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
    folder: "features",
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Replies with the user\'s avatar')
        .addUserOption(option => 
            option.setName("target")
            .setDescription('The target user')
        ),
	async execute(interaction) {
		const user = interaction.options.getUser("target") || interaction.user;
        const avatar = user.displayAvatarURL({ format: 'png', dynamic: true, size: 4096})
        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle(`${user.username}'s avatar`)
            .setImage(avatar)

        interaction.reply({ ephemeral: true, embeds: [embed]})
	},
};