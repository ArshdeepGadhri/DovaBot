const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ComponentType, StringSelectMenuBuilder, ApplicationCommandManager } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('List out the bot commands');

module.exports = {
    cooldown: 5,
    folder: "information",
    data: data,
    async execute(interaction) {
        const { client, channel } = interaction;
        const emojis = {
            information: "📝",
            features: "🪶"
        }

        function getCommand(name) {
            const getCommandID = client.application.commands.cache
                .filter((cmd) => cmd.name === name)
                .map((cmd) => cmd.id);
            return getCommandID;
        }

        const directories = [
            ...new Set(client.commands.map(cmd => cmd.folder))
        ];

        const formatString = (str) => {
            return `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`
        }


        const categories = directories.map((dir) => {
            const getCommands = client.commands
                .filter((cmd) => cmd.folder === dir)
                .map((cmd) => {
                    return {
                        name: cmd.data.name,
                        description: cmd.data.description || "n/a"
                    }
                })

            return {
                directory: formatString(dir),
                commands: getCommands,
            }
        })

        const embed = new EmbedBuilder()
            .setDescription("See lists of commands by selecting a category down below!")
            .setColor("DarkButNotBlack")
            .setAuthor({ name: `${client.user.username}'s Commands`, iconURL: client.user.avatarURL() })

        const components = (state) => [
            new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`help-menu`)
                    .setPlaceholder('Find a category')
                    .setDisabled(state)
                    .addOptions(
                        categories.map(cmd => {
                            return {
                                label: cmd.directory,
                                value: cmd.directory.toLowerCase(),
                                description: `Commands from ${cmd.directory} category`,
                                emoji: emojis[cmd.directory.toLowerCase()] || "💫"
                            }
                        })
                    )
            )
        ]

        const initialMessage = await interaction.reply({ embeds: [embed], components: components(false), ephemeral: true })

        const filter = (interaction) =>
            interaction.user.id === interaction.member.id;

        const collector = channel.createMessageComponentCollector({
            filter,
            componentType: ComponentType.StringSelect,
        })

        collector.on('collect', (interaction) => {
            const [directory] = interaction.values;
            const category = categories.find(
                i => i.directory.toLowerCase() === directory
            )

            const categoryEmbed = new EmbedBuilder()
                .setTitle(`${emojis[directory.toLowerCase()] || null} ${formatString(directory)} commands`)
                .setDescription(`A list of all the commands categorized under ${directory}`)
                .setColor("DarkButNotBlack")
                .addFields(
                    category.commands.map(i => {
                        return {
                            name: `**${formatString(i.name)}**`, //name: `</${i.name}:${getCommand(i.name)}>`,
                            value: `\`${i.description}\``,
                            inline: true
                        }
                    })
                )

            interaction.update({ embeds: [categoryEmbed], ephemeral: true })
        })

        collector.on("end", () => {
            initialMessage.edit({ components: components(true), ephemeral: true });
        });


        // var adminEmail = process.env.ADMIN_EMAIL;
        // var thumbnailURL = interaction.client.user.displayAvatarURL(); 
        // const embed = new EmbedBuilder()
        //     .setColor("DarkGold")
        //     .setTitle("Help (Page 1)")
        //     .setDescription("Help command guide")
        //     .addFields(
        //         { name: "Page 1", value: "Help & Resources (Page 1)" },
        //         { name: 'Page 2', value: "Information Commands (Page 2)" },
        //         { name: 'Page 3', value: "Feature Commands (Page 3)" },
        //         { name: '\u200B', value: '\u200B' },
        //         { name: "Admin email contact", value: adminEmail }
        //     )
        //     .setThumbnail(thumbnailURL)
        //     .setTimestamp();

        // const embed2 = new EmbedBuilder()
        //     .setColor("DarkGold")
        //     .setTitle("Information Commands (Page 2)")
        //     .addFields(
        //         { name: "/calendar", value: "Do /calendar to retrieve the calendar" },
        //         { name: '/faq', value: "Do /faq to list out the most frequently asked questions with answers" },
        //         { name: '/info', value: "Do /info to get information about a user or the server" },
        //         { name: '/private', value: "Do /private to create a private channel to speak to one of the admins" },
        //         { name: '/schedule', value: "Do /schedule and provide a day to get the schedule for that day" },
        //         { name: '/update (get)', value: "Do /update (get) to retrieve the latest set updates by an admin" }
        //     )
        //     .setThumbnail(thumbnailURL)
        //     .setTimestamp();

        // const embed3 = new EmbedBuilder()
        //     .setColor("DarkGold")
        //     .setTitle("Feature Commands (Page 3)")
        //     .addFields(
        //         { name: "/clear", value: "Do /clear to bulk remove messages" },
        //         { name: '/newsletter', value: "Do /newsletter to retrieve the newsletter" },
        //         { name: '/ping', value: "Do /ping to check for the bot's latency" },
        //         { name: '/poll', value: "Do /poll to create a y/n poll" },
        //         { name: '/thread', value: "Do /thread to create a new thread" }
        //     )
        //     .setThumbnail(thumbnailURL)
        //     .setTimestamp();

        // const button = new ActionRowBuilder()
        //         .addComponents(
        //             new ButtonBuilder()
        //                 .setCustomId("page1")
        //                 .setLabel("Page 1")
        //                 .setStyle(ButtonStyle.Secondary),

        //             new ButtonBuilder()
        //                 .setCustomId("page2")
        //                 .setLabel("Page 2")
        //                 .setStyle(ButtonStyle.Secondary),

        //             new ButtonBuilder()
        //                 .setCustomId("page3")
        //                 .setLabel("Page 3")
        //                 .setStyle(ButtonStyle.Secondary),
        //         )

        // const message = await interaction.reply({ embeds: [embed] , components: [button], ephemeral: true})
        // const collector = await message.createMessageComponentCollector();

        // collector.on("collect", async i => {
        //     if (i.customId === 'page1') {
        //         if (i.user.id !== interaction.user.id) {
        //             return;
        //         }
        //         await i.update({ embeds: [embed], components: [button], ephemeral: true })
        //     }

        //     if (i.customId === 'page2') {
        //         if (i.user.id !== interaction.user.id) {
        //             return;
        //         }
        //         await i.update({ embeds: [embed2], components: [button], ephemeral: true })
        //     }

        //     if (i.customId === 'page3') {
        //         if (i.user.id !== interaction.user.id) {
        //             return;
        //         }
        //         await i.update({ embeds: [embed3], components: [button], ephemeral: true })
        //     }
        // })
    },
};