const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('timeout')
	.setDescription('timeout a user')
    .addUserOption(option => 
        option.setName('user')
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('reason')
        .setDescription("The timeout reason")
        .setRequired(true)
    )
    .addNumberOption(option => 
        option.setName('minutes')
        .setDescription("The timeout minutes")
    )

module.exports = {
	cooldown: 5,
	folder: "features",
	data: data,
	async execute(interaction) {
		const user = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason');
        const minutes = interaction.options.getNumber('minutes') || 5;
        user.timeout(minutes * 60 * 1000, reason)

        await interaction.reply({content: `${user.username} was timed out for ${minutes} mins for ${reason}.`, ephemeral: true});
	},
};