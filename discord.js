/* eslint-disable no-console */
const express = require('express')
const { Client, Intents, MessageEmbed } = require('discord.js')
require('dotenv').config()

const app = express()

const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] })
client.on('ready', () => {
  console.log('Bot is online')
})
client.login(process.env.BOT_TOKEN)

function getEmbed(title, fields, variant = 'stable', color = '198754') {
  const messageEmbed = new MessageEmbed({ title: 'test' })
  try {
    messageEmbed
      .setColor(color.replace('#', ''))
      .setTitle(title)
      .setURL(`https://${variant.toLowerCase()}.getautoclicker.com/`)
      .setThumbnail(`https://blog.getautoclicker.com/icons/${variant.toLowerCase()}_icon48.png`)
      .setTimestamp()
      .setFooter(`Auto Clicker - AutoFill ${variant}`, 'https://blog.getautoclicker.com/icons/stable_icon48.png')

    const fieldArray = JSON.parse(fields)
    fieldArray.forEach(field => {
      messageEmbed.addFields(field)
    })
  } catch (error) {
    console.error(error)
  }
  return messageEmbed
}

app.get('/notifyDiscord', async ({ query: { id, title, fields, variant = 'stable', color = '#198754' } }, res) => {
  if (id && title && fields) {
    client.users
      .fetch(id)
      .then(user => {
        const embed = getEmbed(title, fields, variant, color)
        user
          .send({ embeds: [embed] })
          .then(() => res.send('Success'))
          .catch(error => res.send(error || 'Error while sending message Discord Client'))
      })
      .catch(error => res.send(error || `Error while fetching user Discord Client ${id}`))
  } else {
    res.send('Parameters are missing')
  }
})
app.get('/', (req, res) => res.send('Hello World'))
app.listen(process.env.BOT_PORT)
