"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findChannelIdWithName = exports.updateMessage = exports.publishMessage = exports.deleteAllPastMessages = exports.deleteAllPastMessagesWithExclusion = void 0;
const throttled_queue_1 = __importDefault(require("throttled-queue"));
const env_vars_1 = __importDefault(require("../configs/env-vars"));
// Slack Tier 3 throttle
// at most 3 requests per 5 seconds on our end
const throttleTier3 = (0, throttled_queue_1.default)(3, 5000);
const SLACK_BOT_ID = 'A03GLCBJ9DJ';
async function deleteAllPastMessagesWithExclusion(channelId, messageIdExcluded, app) {
    const { messages } = await app.client.conversations.history({
        channel: channelId,
    });
    if (!messages || !messages?.length)
        return Promise.resolve();
    const proms = [];
    messages.forEach((message) => {
        const { ts } = message;
        // console.log(message)
        if (message.bot_id !== SLACK_BOT_ID || !ts || messageIdExcluded.has(ts))
            return;
        const deleteRes = throttleTier3(() => app.client.chat.delete({
            token: env_vars_1.default.slack.bot.token,
            channel: channelId,
            ts,
        }));
        proms.push(deleteRes);
    });
    return Promise.allSettled(proms);
}
exports.deleteAllPastMessagesWithExclusion = deleteAllPastMessagesWithExclusion;
async function deleteAllPastMessages(channelId, app) {
    return deleteAllPastMessagesWithExclusion(channelId, new Set(), app);
}
exports.deleteAllPastMessages = deleteAllPastMessages;
async function publishMessage(channelId, text, app) {
    return app.client.chat.postMessage({
        token: env_vars_1.default.slack.bot.token,
        channel: channelId,
        link_names: true,
        text,
        // use a blocks[] array to send richer content
    });
}
exports.publishMessage = publishMessage;
async function updateMessage(channelId, messageId, text, app) {
    return app.client.chat.update({
        token: env_vars_1.default.slack.bot.token,
        channel: channelId,
        ts: messageId,
        text,
        // use a blocks[] array to send richer content
    });
}
exports.updateMessage = updateMessage;
async function findChannelIdWithName(name, app) {
    try {
        const result = await app.client.conversations.list({
            token: env_vars_1.default.slack.bot.token,
        });
        if (!result || !result.channels)
            return '';
        // eslint-disable-next-line no-restricted-syntax
        for (const channel of result.channels) {
            if (channel.name === name)
                return channel.id;
        }
    }
    catch (error) {
        console.error(error);
    }
    return '';
}
exports.findChannelIdWithName = findChannelIdWithName;
