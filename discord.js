/* eslint-disable no-console */
const express = require('express')
const { Client, Intents, MessageEmbed } = require('discord.js')

const app = express()
const port = 3000

require('dotenv').config()

console.log(process.env.BOT_TOKEN)
const client = new Client({ intents: [Intents.FLAGS.GUILD_MEMBERS] })
client.on('ready', () => {
  console.log('Bot is online')
})
client.login(process.env.BOT_TOKEN)

function getEmbed(title, fields, variant, color) {
  const messageEmbed = new MessageEmbed()
    .setColor(color)
    .setTitle(title)
    .setURL(`https://${variant.toLowerCase()}.getautoclicker.com/`)
    .setThumbnail(`https://blog.getautoclicker.com/icons/${variant.toLowerCase()}_icon48.png`)
    .setTimestamp()
    .setFooter(`Auto Clicker - AutoFill ${variant}`, 'https://blog.getautoclicker.com/icons/stable_icon48.png')
  try {
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
  console.log(id, title, fields, variant, color)
  if (id && title && fields) {
    client.users
      .fetch(id)
      .then(user => {
        user
          .send(getEmbed(title, fields, variant, color))
          .then(() => res.send('Success'))
          .catch(error => res.send(error || 'Error while sending message Discord Client'))
      })
      .catch(error => res.send(error || `Error while fetching user Discord Client ${id}`))
  } else {
    res.send('Parameters are missing')
  }
})
app.get('/', (req, res) => res.send('Hello World'))
app.listen(process.env.BOT_PORT, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
