/* eslint-disable no-console */
const { SecretClient } = require('@azure/keyvault-secrets')
const { DefaultAzureCredential } = require('@azure/identity')
const express = require('express')
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')

const client = new Client({ intents: [GatewayIntentBits.GuildMembers] })
client.on('ready', () => {
  console.log('Bot is online')
})

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

const app = express()
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
app.listen(process.env.PORT || 3000)

async function main() {
  const credential = new DefaultAzureCredential()

  const keyVaultName = 'acf-vault'
  const url = `https://${keyVaultName}.vault.azure.net`

  const secretClient = new SecretClient(url, credential)
  // Create a secret
  // The secret can be a string of any kind. For example,
  // a multiline text block such as an RSA private key with newline characters,
  // or a stringified JSON object, like `JSON.stringify({ mySecret: 'SECRET_VALUE'})`.
  const secretName = 'ACF-BOT-TOKEN'
  // Read the secret we created
  const TOKEN = await secretClient.getSecret(secretName)
  client.login(TOKEN.value)
}

main().catch(error => {
  console.error('An error occurred:', error)
  process.exit(1)
})
