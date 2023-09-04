const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

const translate = require("@iamtraction/google-translate");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate messages to other languages')
        .addStringOption((option) => option
            .setRequired(true)
            .setName("message")
            .setDescription("The message to translate"))
        .addStringOption((option) => option
            .setRequired(true)
            .setName("language")
            .setDescription("The language to translate to")
            .addChoices(
                { name: "English", value: "en"},
                { name: "Latin", value: "la"},
                { name: "French", value: "fr"},
                { name: "German", value: "de"},
                { name: "Italian", value: "it"},
                { name: "Portugese", value: "pt"},
                { name: "Spanish", value: "es"},
                { name: "Greek", value: "gl"},
                { name: "Russian", value: "ru"},
                { name: "Japanese", value: "ja"},
                { name: "Arabic", value: "ar"},
            )),

    async execute(interaction) {
        const message = interaction.options.getString("message")
        const language = interaction.options.getString("language")

        await interaction.reply({ content: `Translating your language...`, ephemeral: true})

        const applied = await translate(message, { to : `${language}`});

        const embed = new EmbedBuilder()
            .setColor("aqua")
            .setTitle("Translator")
            .addFields({ name: "Old Text", value: `\`\`\`${message}\`\`\``, inline: false})
            .addFields({ name: "New Text", value: `\`\`\`${applied.text}\`\`\``, inline: false});
        
        await interaction.editReply({ content:"", embeds: [embed], ephemeral: true });
    },
};