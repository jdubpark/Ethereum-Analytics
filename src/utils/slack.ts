import { App } from '@slack/bolt'
import { ChatDeleteResponse } from '@slack/web-api'
import throttledQueue from 'throttled-queue'

import envVars from '../configs/env-vars'

// Slack Tier 3 throttle
// at most 3 requests per 5 seconds on our end
const throttleTier3 = throttledQueue(3, 5000)

const SLACK_BOT_ID = 'A03GLCBJ9DJ'

export async function deleteAllPastMessagesWithExclusion(channelId: string, messageIdExcluded: Set<string>, app: App) {
  const { messages } = await app.client.conversations.history({
    channel: channelId,
  })

  if (!messages || !messages?.length) return Promise.resolve()

  const proms: Promise<ChatDeleteResponse>[] = []
  messages.forEach((message) => {
    const { ts } = message
    // console.log(message)
    if (message.bot_id !== SLACK_BOT_ID || !ts || messageIdExcluded.has(ts)) return
    const deleteRes = throttleTier3(() => app.client.chat.delete({
      token: envVars.slack.bot.token,
      channel: channelId,
      ts,
    }))
    proms.push(deleteRes)
  })

  return Promise.allSettled(proms)
}

export async function deleteAllPastMessages(channelId: string, app: App) {
  return deleteAllPastMessagesWithExclusion(channelId, new Set(), app)
}

export async function publishMessage(channelId: string, text: string, app: App) {
  return app.client.chat.postMessage({
    token: envVars.slack.bot.token,
    channel: channelId,
    link_names: true,
    text,
    // use a blocks[] array to send richer content
  })
}

export async function updateMessage(channelId: string, messageId: string, text: string, app: App) {
  return app.client.chat.update({
    token: envVars.slack.bot.token,
    channel: channelId,
    ts: messageId, // timestamp is message ID (unique guaranteed)
    text,
    // use a blocks[] array to send richer content
  })
}

export async function findChannelIdWithName(name: string, app: App): Promise<string> {
  try {
    const result = await app.client.conversations.list({
      token: envVars.slack.bot.token,
    })
    if (!result || !result.channels) return ''
    // eslint-disable-next-line no-restricted-syntax
    for (const channel of result.channels) {
      if (channel.name === name) return channel.id as string
    }
  } catch (error) {
    console.error(error)
  }
  return ''
}
