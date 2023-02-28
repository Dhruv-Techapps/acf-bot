const { SecretClient } = require('@azure/keyvault-secrets')
const { DefaultAzureCredential } = require('@azure/identity')
const express = require('express')
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js')

const origins = ['chrome-extension://abcfldlhjfincogogjfbbkdnbfnlaaef', 'chrome-extension://cpjikgcdmhfnmaiibplplldlchbjejel', 'chrome-extension://nmcpliniiebkbdehpgicgfcidgkpepep']
const client = new Client({ intents: [GatewayIntentBits.GuildMembers] })
client.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log('Bot is online')
})

function getEmbed(title, fields, variant = 'stable', color = '198754') {
  const messageEmbed = new EmbedBuilder()
  messageEmbed
    .setColor(color.replace('#', ''))
    .setTitle(title)
    .setURL(`https://${variant.toLowerCase()}.getautoclicker.com/`)
    .setThumbnail(`https://getautoclicker.com/icons/${variant.toLowerCase()}_icon48.png`)
    .setTimestamp()
    .setFooter({ text: `Auto Clicker - AutoFill ${variant}`, iconURL: 'https://getautoclicker.com/icons/stable_icon48.png' })
  fields.forEach(field => {
    messageEmbed.addFields(field)
  })
  return messageEmbed
}

const app = express()
app.use(express.json())

app.post('/discord', async ({ body: { id, title, fields, variant = 'stable', color = '#198754' }, headers: { origin } }, res) => {
  if (origins.includes(origin)) {
    if (id && title && fields) {
      client.users
        .fetch(id)
        .then(user => {
          const embed = getEmbed(title, fields, variant, color)
          // eslint-disable-next-line no-console
          user.send({ embeds: [embed] }).catch(error => console.error(error || 'Error while sending message Discord Client'))
        })
        // eslint-disable-next-line no-console
        .catch(error => console.error(error || `Error while fetching user Discord Client ${id}`))
    }
  }
  res.send('')
})

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
  // eslint-disable-next-line no-console
  console.error('An error occurred:', error)
  process.exit(1)
})
