const mongo = require('./mongo')
const command = require('./command')
const welcomeSchema = require('./schemas/welcome-schema')
const { guild, MessageManager } = require('discord.js')

module.exports = (client) => {
    //!setwelcome <hoş geldin mesajı>
    const cache = { } //guildId: [channelId, text ]


    command(client, 'setwelcome', async (message) => {
        const { member, channel, content, guild } = message

        if (!member.hasPermission('ADMINISTRATOR')) {
            channel.send(' Bu Komudu kullanmanıza izniniz yoktur.')
            return 
        }

        let text = content
        const split = text.split(' ')

        if (split.leght <2) {
            channel.send(' Lütfen Hoşgeldin Mesajınızı Yazınız')
            return
        }

        split.shift()
        text = split.join(' ')

        cache[guild.id] = [channel.id, text]
        await mongo().then(async (mongoose)=>{
            try{
                await welcomeSchema.findOneAndUpdate(
                {
                    _id: guild.id
                },
                {
                    _id: guild.id,
                    channedId: channel.id,
                    text,

                },
                {
                    upsert:true
                })

            }finally{
                mongoose.connection.close()
            }
          })
        })
        const onJoin = async member => {
            const { guild } = member

            let data = cache[guild.id]
            if (!data) {
                console.log(' Bunları yapıyor işte')
                await mongo().then( async mongoose => {
                    try {
                        const result = await welcomeSchema.findOne({ _id: guild.id })

                        cache[guild.id] = data = [result.channedId, result.text]
                    } finally {
                        mongoose.connection.close()
                    }
                })
            }
            const channelId = data[0]
            const text = data[1]

            const channel = guild.channels.cache.get(channelId)
            channel.send(text.replace(/<@>/g, `<@${member.id}>` ))

            //<@>
        }

        command(client, 'simjoin', message => {  //on son mesajı gösterir
            onJoin(message.member)
        })
        client.on('guildMemberAdd', member => {
            onJoin(member)
        })
}