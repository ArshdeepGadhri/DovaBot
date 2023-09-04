async function getAnime(url) {
    var data = await fetch(
        `https://api.trace.moe/search?anilistInfo&url=${encodeURIComponent(
            url
        )}`
    ).then((e) => e.json())
    return data;
}

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('animesauce')
        .setDescription('Replies with the data of the anime from the photo provided')
        .addAttachmentOption((option) => option
            .setRequired(true)
            .setName("image")
            .setDescription("The image to look-up")),
    async execute(interaction) {
        const attachment = interaction.options.getAttachment("image")

        const url = attachment.url
        var data = await getAnime(url)
      
        data = data.result[0];
        
        var episode = data.episode
        var from = Math.floor(data.from / 60)
        var to = Math.floor(data.to / 60)
        var similarity = (data.similarity*100).toFixed(2) + "%"
        var video = data.video
        var anilist = data.anilist
        var title = anilist.title.english
        var synonyms = anilist.synonyms
        var nsfw = anilist.isAdult
        var malID = anilist.idMal;
        
        const embed = new EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(`**Synonyms**\n${synonyms.join("\n")}`)
            .addFields([
                { name: "Episode", value: `${episode}`, inline: true },
                { name: "at", value: `${from} min`, inline: true },
                { name: "NSFW", value: `${nsfw}`, inline: true },
                { name: "Mal ID", value: `${malID}`, inline: true },
            ])
            .setImage(video)
            .setFooter({iconURL: data.image, text: `Similarity ${similarity}`})
            .setColor('Aqua');

        await interaction.reply({ embeds: [embed], ephemeral: true });
    },
};