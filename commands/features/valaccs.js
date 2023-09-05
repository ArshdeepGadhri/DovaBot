const { SlashCommandBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('valaccs')
    .setDescription('Get or add valorant accounts')
    .addSubcommand(subcommand =>
        subcommand
            .setName('get')
            .setDescription('Get valorant accounts in your database with specified rank')
            .addStringOption(option => option.setName('rank').setDescription('The rank').setRequired(true)))
    .addSubcommand(subcommand =>
        subcommand
            .setName('add')
            .setDescription('Add valorant account to your database')
            .addStringOption(option => option.setName('username').setDescription('The account username').setRequired(true))
            .addStringOption(option => option.setName('password').setDescription('The account password').setRequired(true))
            .addStringOption(option => option.setName('riotid').setDescription('The account riotID').setRequired(true))
            .addStringOption(option => option.setName('tagline').setDescription('The account tagline').setRequired(true))
            .addStringOption(option => option.setName('rank').setDescription('The account rank').setRequired(true)
                .addChoices(
                    { name: 'Unraked', value: 'Unranked' },
                    { name: 'Iron', value: 'Iron I' },
                    { name: 'Bronze', value: 'Bronze I' },
                    { name: 'Silver', value: 'Silver I' },
                    { name: 'Gold', value: 'Gold I' },
                    { name: 'Platinum', value: 'Platinum I' },
                    { name: 'Diamond', value: 'Diamond I' },
                    { name: 'Ascendant', value: 'Ascendant I' },
                    { name: 'Immortal', value: 'Immortal I' },
                    { name: 'Radiant', value: 'Radiant' },
                ))
            .addStringOption(option => option.setName('notes').setDescription('Notes about the account'))
    );


const url = "http://18.217.11.239:8000";

async function getToken(usernameInput, passwordInput) {
    const response = await fetch(`${url}/accounts/signin/`, {
        method: 'POST',
        node: "cors",
        headers: { 'Content-Type': 'application/json' },
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
    })
    const data = await response.json();
    return data;
}

async function getAccounts(rank, token) {
    const response = await fetch(`${url}/accounts/val/search/${rank}/`, {
        method: 'GET',
        referrerPolicy: 'no-referrer',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
    })
    const data = await response.json();
    return data;
}

async function addAccount(token, username, password, riot_id = "", rank, tagline = "", notes = "") {
    let formData = new FormData();

    formData.append('username', username)
    formData.append('password', password);
    formData.append('rank', rank);

    if (riot_id) formData.append('riot_id', riot_id);
    if (tagline) formData.append('tagline', tagline);
    if (notes) formData.append('notes', notes);

    const response = await fetch(`${url}/accounts/val/create/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body: formData
    })
    const data = await response.json();
    return data;
}


module.exports = {
    cooldown: 5,
    data: data,
    async execute(interaction) {
        const modal = new ModalBuilder({
            customId: `login-${interaction.user.id}`,
            title: "Login to ValAccs account"
        })

        const username = new TextInputBuilder({
            customId: `usernameInput`,
            label: "Username",
            style: TextInputStyle.Short
        })

        const password = new TextInputBuilder({
            customId: `passwordInput`,
            label: "Password",
            style: TextInputStyle.Short
        })

        const firstActionRow = new ActionRowBuilder()
            .addComponents(username)

        const secondActionRow = new ActionRowBuilder()
            .addComponents(password)

        modal.addComponents(firstActionRow, secondActionRow)

        await interaction.showModal(modal);

        const filter = (interaction) => interaction.customId === `login-${interaction.user.id}`;

        var usernameInput;
        var passwordInput;

        const embed = new EmbedBuilder()
            .setColor("Aqua")
            .setThumbnail("http://13.59.235.38/logo512.png");

        interaction
            .awaitModalSubmit({ filter, time: 30_000 * 3 })
            .then(modalInteraction => {
                usernameInput = modalInteraction.fields.getTextInputValue("usernameInput")
                passwordInput = modalInteraction.fields.getTextInputValue("passwordInput")

                var token = "token";
                getToken(usernameInput, passwordInput).then(data => {
                    if (data.detail === 'No active account found with the given credentials') {
                        modalInteraction.reply({ content: "No active account found with the given credentials for http://13.59.235.38", ephemeral: true });
                        return;
                    }

                    token = data.access

                    if (interaction.options.getSubcommand() === 'get') {
                        var rank = interaction.options.getString("rank");

                        getAccounts(rank, token).then(data => {
                            embed.setTitle(`Your Val Accounts ranked ${rank}`)
                            embed.setURL("http://13.59.235.38")
                            data.forEach(account => {
                                embed.addFields([{ name: `Username: ${account.username}\nPassword: ${account.password}`, value: `**${account.riot_id}#${account.tagline}**\n${account.rank}\n-${account.notes}`, inline: false }, { name: '\u200B', value: ' ' }])
                            })
                            modalInteraction.reply({ embeds: [embed], ephemeral: true });
                        })

                    } else if (interaction.options.getSubcommand() === 'add') {
                        var username = interaction.options.getString("username");
                        var password = interaction.options.getString("password");
                        var riot_id = interaction.options.getString("riotid");
                        var accountRank = interaction.options.getString("rank");
                        var tagline = interaction.options.getString("tagline");
                        var notes = interaction.options.getString("notes");

                        addAccount(token, username, password, riot_id, accountRank, tagline, notes).then(data => {
                            embed.setTitle(`Your Val Account has been added`)
                            embed.setURL("http://13.59.235.38")
                            var createdAt = data.created_at;
                            var rank = data.rank;
                            var id = data.id;
                            embed.setFooter({ iconURL: "http://13.59.235.38/logo512.png", text: `created at ${createdAt} with id ${id}` })
                            embed.setDescription(`Username - ${username}\nPassword - ${password} (${rank})`)
                            embed.addFields({ name: `${riot_id}#${tagline}`, value: `Notes: ${notes}`, inline: true })
                            embed.addFields({ name: '\u200B', value: `Edit/Add more details to the accounts through the website`, inline: false })
                            modalInteraction.reply({ embeds: [embed], ephemeral: true });
                        })
                    }
                });


            })
            .catch(err => {
                console.log(`Error: ${err}`)
            });

    },
};