const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
			var server = interaction.guild;
			const emojis = server.emojis.cache;
        	const roles = server.roles.cache;

			server.members.fetch(server.ownerId).then((owner) => {
				const embed = new EmbedBuilder()
				.setColor('#FFFFFF')
				.setTitle('📊 Server Info')
				.setThumbnail(server.iconURL({ format: 'png', dynamic: true, size: 1024 }))
				.setDescription(`
					**Server Name:** ${server.name}
					**Server ID:** ${server.id}
					**Owner:** ${owner.user.tag}
					**Created At:** ${server.createdAt.toUTCString()}
					**Members:** ${server.memberCount}
					**Emojis:** ${emojis.size} emojis
					**Roles:** ${roles.size} roles
				`)
				.setTimestamp();
			
		
			interaction.reply({ embeds: [embed], ephemeral: true })
			}).catch((err) => console.log(`Error: ${err}`));
		}
	},
};