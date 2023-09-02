const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('update')
    .setDescription('Set or Retrieve latest updates about the bot!')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand(subcommand =>
        subcommand
            .setName('get')
            .setDescription('Set latest updates about the bot!')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('set')
            .setDescription('Retrieve latest updates about the bot!')
            .addStringOption(option =>
                option.setName('title')
                    .setDescription('Update title')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('description')
                    .setDescription('Update description')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('subtitle')
                    .setDescription('Update sub title')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('subdescription')
                    .setDescription('Update sub description')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('footer')
                    .setDescription('Update footer')
                    .setRequired(true)
            )
    );


function sendEmbed(title, description, author, authorIcon, subTitle, subDescription, footer) {
    var updateEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(title)
        .setAuthor({ name: author, iconURL: authorIcon })
        .setDescription(description)
        .addFields(
            { name: subTitle, value: subDescription },
            { name: '\u200B', value: '\u200B' },
        )
        .setTimestamp()
        .setFooter({ text: footer });
    return updateEmbed;
}


module.exports = {
    cooldown: 5,
    data: data,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'set') {

            if (!interaction.member.hasPermission('ADMINISTRATOR')) {
                await interaction.reply({
                    content: 'You do not have access to this command.',
                    ephemeral: true,
                });
                return;
            }
            const fs = require("fs");
            var data = JSON.parse(fs.readFileSync("./updates.json", "utf8")) || [];

            var title = interaction.options.getString("title");
            var description = interaction.options.getString("description");
            var subTitle = interaction.options.getString("subtitle");
            var subDescription = interaction.options.getString("subdescription");
            var footer = interaction.options.getString("footer");

            data.push({ title, description, subTitle, subDescription, footer, updatedAt: new Date() })

            fs.writeFile('./updates.json', JSON.stringify(data), err => {
                if (err) {
                    console.log('Error writing file', err)
                } else {
                    interaction.reply(`Saved.`);
                    setTimeout(() => interaction.deleteReply(), 20000);
                    console.log('Successfully wrote file');
                }
            })
        } else if (interaction.options.getSubcommand() === 'get') {
            const fs = require("fs");
            fs.readFile("./updates.json", "utf8", (err, jsonString) => {
                if (err) {
                    console.log("Error reading file from disk:", err);
                    return;
                }
                try {
                    const data = JSON.parse(jsonString).at(-1);
                    var title = data.title;
                    var description = data.description;
                    var subTitle = data.subTitle;
                    var subDescription = data.subDescription;
                    var footer = data.footer;
                    var user = interaction.user;
                    var author = user.globalName + " here are the latest updates.";
                    var authorIcon = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`;
                    interaction.reply({ embeds: [sendEmbed(title, description, author, authorIcon, subTitle, subDescription, footer)], ephemeral: true })
                } catch (err) {
                    console.log("Error parsing JSON string:", err);
                }
            });
        }
    },
};
