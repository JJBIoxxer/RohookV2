const { readdirSync } = require('fs');
const { join, extname } = require('path')

const { Collection } = require('discord.js');

const commands = new Collection();

const commandFiles = readdirSync(__dirname).filter(file => extname(file) === '.js' && !file.startsWith('index'));

let commandsLoaded = 0;
const totalCommands = commandFiles.length;

for (const file of commandFiles) {
    const filePath = join(__dirname, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        commands.set(command.data.name, command);
        console.log(`✅ The command "${command.data.name}" was loaded successfully.`);
        commandsLoaded += 1;
    } else {
        console.log(`❌ The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

console.log(`${commandsLoaded == totalCommands && '😀' || '😕'} ${commandsLoaded}/${totalCommands} commands were loaded successfully.\n`);

module.exports = commands;