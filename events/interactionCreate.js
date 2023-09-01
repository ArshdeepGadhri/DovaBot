const { Events } = require('discord.js');

const blockedUsers = ["userID1"];
module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (blockedUsers.includes(interaction.user.id)) return;
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};