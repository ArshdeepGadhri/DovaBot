const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('timeout')
	.setDescription('timeout a user')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addUserOption(option => 
        option.setName('user')
        .setDescription("The user to timeout")
        .setRequired(true)
    )
    .addStringOption(option => 
        option.setName('reason')
        .setDescription("The timeout reason")
        .setMaxLength(512)
    )
    .addNumberOption(option => 
        option.setName('minutes')
        .setDescription("The timeout minutes")
    )

module.exports = {
	cooldown: 5,
	folder: "features",
	data: data,
	async execute(interaction) {
		const user = interaction.options.getMember('user');
        const member = interaction.member;
        const reason = interaction.options.getString('reason');
        const minutes = interaction.options.getNumber('minutes') || 5;

        if (member.roles.highest.position > user.roles.highest.position) {
            user.timeout(minutes * 60 * 1000, reason).catch(err => console.log(`Error :${err}`))
        }
        
        await interaction.reply({content: `${user} was timed out for ${minutes} mins for ${reason}.`, ephemeral: true});
	},
};