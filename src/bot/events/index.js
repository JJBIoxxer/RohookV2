const { readdirSync } = require('fs');
const { join, extname } = require('path');

const eventFiles = readdirSync(__dirname).filter(file => extname(file) === '.js' && !file.startsWith('index'));

async function init(client) {
    let eventsLoaded = 0;
    const totalEvents = eventFiles.length;

    for (const file of eventFiles) {
        const filePath = join(__dirname, file);
        const event = require(filePath);
    
        try {
            if ('name' in event && 'execute' in event) {
                if (event.once) {
                    client.once(event.name, event.execute);
                } else {
                    client.on(event.name, event.execute);
                }
                console.log(`✅ The event "${event.name}" was loaded successfully.`);
                eventsLoaded += 1;
            } else {
                console.log(`❌ The event at ${filePath} is missing a required "name" or "execute" property.`);
            }
        } catch(error) {
            console.log(`❌ Unexpected error occurred while loading event at "${filePath}".\n${error.message}`);
        }
    }
    
    console.log(`${eventsLoaded == totalEvents && '😀' || '😕'} ${eventsLoaded}/${totalEvents} events were loaded successfully.\n`);
}

module.exports = {init};