
const { Events, ActivityType } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: false,
	execute(client) {
		
	client.user.setActivity('Doing training things...', { type: ActivityType.Custom });
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};