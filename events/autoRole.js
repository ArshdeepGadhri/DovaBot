const { Events, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { Captcha } = require("captcha-canvas");

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.on(Events.GuildMemberAdd, async (member) => {
			const captcha = new Captcha();
			captcha.async = true;
			captcha.addDecoy();
			captcha.drawTrace();
			captcha.drawCaptcha();

			const captchaAttachment = new AttachmentBuilder(
				await captcha.png,
				{ name: 'captcha.png' }
			)

			const captchaEmbed = new EmbedBuilder()
				.setDescription("1 Minute to solve.")
				.setImage(`attachment://captcha.png`)
				.setTitle("Solve the Captcha to get access to the server.")

			const msg = await member.send({
				files: [captchaAttachment],
				embeds: [captchaEmbed]
			})

			const filter = (message) => {
				if (message.author.id !== member.id) return;
				if (message.content === captcha.text) return true;
				else {
					member.send("Incorrect Captcha. You have been removed from the server.")
					member.kick("Captcha failure.")
				}
			}
			try {
				const response = await msg.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] })
				
				if (response) {
					const roleID = process.env.MEMBER_ROLE_ID;
					var role = await member.guild.roles.cache.get(roleID);
					member.roles.add(role);
					await member.send("Verified.")
				}
			} catch (err) {
				await member.send("You ran out of time. You have been removed from the server.").catch(err => {
					console.log("Error with captcha, could not dm user that has already been kicked.")
				})
				await member.kick("Captcha time condition.")
			}

		})
	},
};