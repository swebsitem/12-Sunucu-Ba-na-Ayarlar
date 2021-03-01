const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const command = require('./command')
const welcome = require('./welcome')
const memberCount = require('./member-count')
const mongo = require('./mongo')
const EventEmitter = require('events')

EventEmitter.defaultMaxListeners = 50

client.on('ready', async () => {
  console.log('Bot Hazır ve Online!')

  await mongo().then((mongoose) => {
    try{
      console.log('Mongo Bağlandı')
    } finally {
      mongoose.connection.close()
    }
  })

  command(client, ['açık' , 'hazır' , 'hadi'], (message) => {
      message.channel.send('Botunuz Hazır ve Emirlerinize Avade Patron')
  })

  command(client, 'sunucu', (message) => {
      client.guilds.cache.forEach((guild) => {
       // console.log(guild)
        message.channel.send(
          `${guild.name} Sunucusunda Toplamda ${guild.memberCount} üye bulumaktadır.`
        )
      })    
  })

  command(client, ['cc', 'sil', 'temizle'], (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results)
      })
    }
  })

  command(client, 'durum', (message) => {
    const content = message.content.replace('!durum', '' )
    //"!durum Davet Kodu :....   - > Davet Kodu : ....."

    client.user.setPresence({
      activity:{
        name: content,
        type:0,
      }
    })
  })

  command(client, 'text', (message) => {
    const name = message.content.replace('!text', '')
    //!metinkanal MetinKanalİsmi
    message.guild.channels
    .create(name,{
      type:'text',
    })
    .then((channel) => {
      const categoryId = '735670677322989610' // Kategori İd
      channel.setParent(categoryId)
    })
  })

  command(client, 'ses', (message) => {
    const name = message.content.replace('!ses', '')

    message.guild.channels
    .create(name, {
      type: 'voice',     
    })
    .then((channel) => {
      const categoryId = '735670677322989610' // Kategori İd
      channel.setParent(categoryId)
      channel.setUserLimit(10)
    })
  })

  command(client, 'youtube', (message) => {
    //console.log(message.author)
    const logo = 'https://superwebsitem.com/wp-content/uploads/logo-300x70-1.png'
    const embed = new Discord.MessageEmbed()
    .setTitle('SuperWebSitem Youtube Kanalı')
    .setURL('https://www.youtube.com/channel/UC8bo-3cpU3IyZqkGVCxVNUA')
    .setAuthor(message.author.username)
    //.setImage(logo)
    .setThumbnail(logo)
    .setFooter('İletişim İçin Cassquettes#3040')
    .setColor('#FF0000')
    .addFields(
      {
        name:'WordPress Dersleri',
        value: 'Seo Çalışmaları',
        inline: true,
      },
      {
        name:'Python Dersleri ',
        value: 'Python Proglama',
        inline: true,
      }
    )
    message.channel.send(embed)
  })
  command(client, 'sunucubilgi', (message) => {
                                              //message.channel.send('Yakında Hazır')
        const {guild} = message
                                            //console.log(guild)

    const { name, region, memberCount, afkTimeout, afkChannelID, applicationID } = guild
    const icon = guild.iconURL()
                                            //    console.log(name, region, memberCount, icon)
  const embed = new Discord.MessageEmbed()
      .setTitle(`"${name}"İçin sunucu bilgileri`)
      .setThumbnail(icon)
      .addFields(
        {
          name: 'Bölge',
          value: region,
        },
                {
          name: 'Üye Sayısı',
          value: memberCount,
        },
                {
          name: 'AFK Zamanı',
          value: afkTimeout,
        },
        {
          name: 'AFK Kanal İd',
          value: afkChannelID,
        }

      )

    message.channel.send(embed)
  })

  command(client, 'ban', (message) => {
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if(member.hasPermission('ADMINISTRATOR') ||
       member.hasPermission('BAN_MEMBERS')
       ) {
        //console.log('Çalışıyor')
        const target = mentions.users.first()
        //console.log(target)
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.ban()
            message.channel.send(`${tag} kullanıcısı banlandı.  `)
        }else{
          message.channel.send(`${tag} Banlayacağınız kişiyi etiketleyin. `)
        }
       } else {
         message.channel.send(
          `${tag} Bu işlemi yapmanız için izniniz bulunmamaktadır.` 
         )
       }
  })

  command(client, 'kick', (message) => {
    const { member, mentions } = message

    const tag = `<@${member.id}>`

    if(member.hasPermission('ADMINISTRATOR') ||
       member.hasPermission('KICK_MEMBERS')
       ) {
        //console.log('Çalışıyor')
        const target = mentions.users.first()
        //console.log(target)
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id)
            targetMember.kick()
            message.channel.send(`${tag} kullanıcısı atıldı.  `)
        }else{
          message.channel.send(`${tag} atılacak kişiyi etiketleyin. `)
        }
       } else {
         message.channel.send(
          `${tag} Bu işlemi yapmanız için izniniz bulunmamaktadır.` 
         )
       }
  })

  welcome(client)
  memberCount(client)

})

client.login(config.token)
