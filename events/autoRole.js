const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.on(Events.GuildMemberAdd, async (member) => {
			const roleID = process.env.AUTO_ROLE_ID;
			var role = await member.guild.roles.cache.get(roleID);
			member.roles.add(role);
		})
	},
};