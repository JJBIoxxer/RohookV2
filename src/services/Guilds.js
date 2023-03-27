const { Guild: GuildModel } = require('../db');

module.exports.create = async (object) => new GuildModel(object);

module.exports.get = async (guildId) => {
    let document = await GuildModel.findOne({ guildId });

    if (!document) return;

    if (document.isBanned) {
        const { banInfo } = document;
        const timeRemaining = (banInfo.started.getTime() + banInfo.length) - Date.now();

        if (!banInfo.isPermanent && timeRemaining <= 0) document = await document.unban();
    }

    return document;
}