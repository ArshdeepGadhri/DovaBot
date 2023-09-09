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
            .setThumbnail("https://cutewallpaper.org/24/help-icon-png/peer-help-vector-icons-free-download-in-svg-png-format.png")
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
                .setThumbnail("https://cutewallpaper.org/24/help-icon-png/peer-help-vector-icons-free-download-in-svg-png-format.png")
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
    },
};