const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Info about the server'));

module.exports = {
	cooldown: 5,
	data: data,
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply({content: `Username: ${user.username}\nID: ${user.id}`, ephemeral: true});
			} else {
				await interaction.reply({content: `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`, ephemeral: true});
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply({content: `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`, ephemeral: true});
		}
	},
};