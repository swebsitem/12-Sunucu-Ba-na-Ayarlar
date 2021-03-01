module.exports = (client) => {
    const channelId = '814674398983487508' // welcome kanalı
    const targetChanelId = '748241956403937292' // kurallar kanalı

    client.on('guildMemberAdd', (member) => {
        const mesaj = `Sunucumuza Hoşgeldiniz <@${member.id}> 
        Lütfen Kurallar Kanalını Okuyunuz ${member.guild.channels.cache
        .get(targetChanelId)
        .toString()} `

       const channel = member.guild.channels.cache.get(channelId)
       channel.send(mesaj) 
    })
}