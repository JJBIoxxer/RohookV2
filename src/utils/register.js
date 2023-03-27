const { readdirSync } = require('fs');
const { join, extname } = require('path');

const { REST, Routes } = require('discord.js');

require('dotenv').config();

const commands = [];
const developerCommands = [];

const commandsPath = join(__dirname, '../bot/commands');
const commandFiles = readdirSync(commandsPath).filter(file => extname(file) === '.js' && !file.startsWith('index'));

for (const file of commandFiles) {
    const command = require(join(commandsPath, file));
    if (command.creatorOnly || command.developerOnly) {
        developerCommands.push(command.data.toJSON());
    } else {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length + developerCommands.length} application (/) command(s).`);
        const data = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        const developerData = await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD_ID), { body: developerCommands });
        console.log(`Successfully reloaded ${data.length} public and ${developerData.length} developer application (/) command(s).`);
    } catch (error) {
        console.error(error);
    }
})();