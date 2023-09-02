const { SlashCommandBuilder, ChannelType, ThreadAutoArchiveDuration } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('faq')
		.setDescription('Frequency asked questions')
		.addStringOption(option =>
			option.setName('question')
				.setDescription('The question')
				.setRequired(true)
				.addChoices(
					{ name: 'Who do I reach out to if I am not receiving my pay for my position?', value: 'You can contact your direct supervisor or email joseph.briones@email.ucr.edu' },
					{ name: 'Who is in charge of crisis and development?', value: 'John Paul Wolf' },
					{ name: 'More specific question', value: 'other' }
				)),
	async execute(interaction) {
		var answer = interaction.options.getString("question");
		if (answer === 'other') {
			const channel = interaction.channel;
			const user = interaction.user;
			const userName = user.username;
			const threadName = userName + "'s Question";
			try {
				// Create a new private thread 
				const threadChannel = await channel.threads
					.create({
						name: threadName,
						autoArchiveDuration: ThreadAutoArchiveDuration.ThreeDays,
						type: ChannelType.PrivateThread,
						reason: 'Inquiries',
					});

				await threadChannel.members.add(user);

				await interaction.reply({
					content: 'A private channel has been created for you to ask your question!',
					ephemeral: true,
				});
				return;
			} catch (error) {
				console.log(error);
			}
		}
		await interaction.reply({ content: answer, ephemeral: true })
	},
};