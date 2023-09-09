const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, AttachmentBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
    .setName('pushnewsletter')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDescription('push newsletters');

module.exports = {
    cooldown: 5,
    data: data,
    folder: "information",
    async execute(interaction) {
        const guild = interaction.guild;
        const roleName = process.env.ROLE_NAME;
        const role = guild.roles.cache.find(role => role.name === roleName); // Newsletter
        const allMembers = await interaction.guild.members.fetch();

        var membersWithRole = [];
        allMembers.forEach(member => {
            if (member.roles.cache.has(role.id)) {
                membersWithRole.push(member);
            }
        })

        const newsletterFile = process.env.NEWS_LETTER_FILE;  
        const file = new AttachmentBuilder(`./${newsletterFile}`);

        membersWithRole.forEach(person => {
            person.user.send({content: "Here is your newsletter", files: [file]});
        })
        interaction.reply({content: "The users with the role have been sent the file(s).", ephemeral: true})
    },
};