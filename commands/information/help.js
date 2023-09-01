const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

const data = new SlashCommandBuilder()
	.setName('help')
	.setDescription('List out the bot commands');

module.exports = {
	cooldown: 5,
	data: data,
	async execute(interaction) {
        var adminTag = process.env.ADMIN_TAG;
        var thumbnailURL = interaction.client.user.displayAvatarURL(); 
		const embed = new EmbedBuilder()
            .setColor("DarkGold")
            .setTitle("Help (Page 1)")
            .setDescription("Help command guide")
            .addFields(
                { name: "Page 1", value: "Help & Resources (Page 1)" },
                { name: 'Page 2', value: "Information Commands (Page 2)" },
                { name: 'Page 3', value: "Feature Commands (Page 3)" },
                { name: '\u200B', value: '\u200B' },
                { name: "Admin email contact", value: "ardtraining@o365ucr.onmicrosoft.com" }
            )
            .setThumbnail(thumbnailURL)
            .setTimestamp();
        
        const embed2 = new EmbedBuilder()
            .setColor("DarkGold")
            .setTitle("Information Commands (Page 2)")
            .addFields(
                { name: "/calendar", value: "Do /calendar to retrieve the calendar" },
                { name: '/faq', value: "Do /faq to list out the most frequently asked questions with answers" },
                { name: '/info', value: "Do /info to get information about a user or the server" },
                { name: '/private', value: "Do /private to create a private channel to speak to one of the admins" },
                { name: '/pushnewsletter', value: "Do /pushnewsletter to push the newsletter to all users with the role (admin)" },
                { name: '/schedule', value: "Do /schedule and provide a day to get the schedule for that day" },
                { name: '/update (get)', value: "Do /update (get) to retrieve the latest set updates by an admin" }
            )
            .setThumbnail(thumbnailURL)
            .setTimestamp();

        const embed3 = new EmbedBuilder()
            .setColor("DarkGold")
            .setTitle("Feature Commands (Page 3)")
            .addFields(
                { name: "/clear", value: "Do /clear to bulk remove messages" },
                { name: '/newsletter', value: "Do /newsletter to retrieve the newsletter" },
                { name: '/ping', value: "Do /ping to check for the bot's latency" },
                { name: '/poll', value: "Do /poll to create a y/n poll" },
                { name: '/thread', value: "Do /thread to create a new thread" }
            )
            .setThumbnail(thumbnailURL)
            .setTimestamp();
        
        const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("page1")
                        .setLabel("Page 1")
                        .setStyle(ButtonStyle.Secondary),

                    new ButtonBuilder()
                        .setCustomId("page2")
                        .setLabel("Page 2")
                        .setStyle(ButtonStyle.Secondary),
                    
                    new ButtonBuilder()
                        .setCustomId("page3")
                        .setLabel("Page 3")
                        .setStyle(ButtonStyle.Secondary),
                )

        const message = await interaction.reply({ embeds: [embed] , components: [button], ephemeral: true})
        const collector = await message.createMessageComponentCollector();

        collector.on("collect", async i => {
            if (i.customId === 'page1') {
                if (i.user.id !== interaction.user.id) {
                    return;
                }
                await i.update({ embeds: [embed], components: [button], ephemeral: true })
            }

            if (i.customId === 'page2') {
                if (i.user.id !== interaction.user.id) {
                    return;
                }
                await i.update({ embeds: [embed2], components: [button], ephemeral: true })
            }

            if (i.customId === 'page3') {
                if (i.user.id !== interaction.user.id) {
                    return;
                }
                await i.update({ embeds: [embed3], components: [button], ephemeral: true })
            }
        })
	},
};