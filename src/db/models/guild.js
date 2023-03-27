const { model, Schema, Document } = require('mongoose');

const guildSchema = new Schema({
    guildId: { type: String, required: true },
    userIds: { type: [String], default: [] },
    placeIds: { type: [Number], default: [] },
    token: { type: String, default: undefined },
    masterToken: { type: String, default: undefined },
    isBanned: { type: Boolean, default: false },
    banInfo: {
        type: {
            reason: { type: String, required: true },
            length: { type: Number, required: true },
            started: { type: Date, default: Date.now() },
            isPermanent: { type: Boolean, required: true }
        },
        default: undefined
    }
});

guildSchema.methods.ban = async function ban(length, reason) {
    this.isBanned = true;
    this.banInfo = {
        reason: reason,
        length: length,
        started: Date.now(),
        isPermanent: length == -1
    }

    return await this.save();
}

guildSchema.methods.unban = async function unban() {
    this.isBanned = false;
    this.banInfo = undefined;

    return await this.save();
}

module.exports = { name: 'Guild', model: model('Guild', guildSchema) };