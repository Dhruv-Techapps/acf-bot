/* eslint-disable no-console */
const express = require('express')
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config()
}

const app = express()

const client = new Client({ intents: [GatewayIntentBits.GuildMembers] })
client.on('ready', () => {
  console.log('Bot is online')
})
client.login(process.env.TOKEN)

function getEmbed(title, fields, variant = 'stable', color = '198754') {
  const messageEmbed = new EmbedBuilder()
  messageEmbed
    .setColor(color.replace('#', ''))
    .setTitle(title)
    .setURL(`https://${variant.toLowerCase()}.getautoclicker.com/`)
    .setThumbnail(`https://blog.getautoclicker.com/icons/${variant.toLowerCase()}_icon48.png`)
    .setTimestamp()
    .setFooter({ text: `Auto Clicker - AutoFill ${variant}`, iconURL: 'https://blog.getautoclicker.com/icons/stable_icon48.png' })
  const fieldArray = JSON.parse(fields)
  fieldArray.forEach(field => {
    messageEmbed.addFields(field)
  })
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
app.listen(3000)
