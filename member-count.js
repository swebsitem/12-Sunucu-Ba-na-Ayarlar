module.exports = client => {
    const channelId = '814690478107918366'

    const updateMembers = guild => {
        const channel = guild.channels.cache.get(channelId)
        channel.setName(` Toplam Üye: ${guild.memberCount.toLocaleString()}` )
    }

    client.on('guildMemberAdd', (member) => updateMembers(member.guild))
    client.on('guildMemberRemove', (member) => updateMembers(member.guild))

    const guild = client.guilds.cache.get('723257544268578816')
    updateMembers(guild)
}