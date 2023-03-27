const { readdirSync } = require('fs');
const { join, extname } = require('path');

const mongoose = require('mongoose');

const db = {};

db.init = async (uri, callback) => {
    await mongoose.connect(uri).then(() => {
        console.log(`✅ Successfully connected to MongoDB.\n`);
        if (typeof callback === 'function') callback();
    }).catch(error => {
        console.log(`❌ Unexpected error occurred while connecting to MongoDB.\n📄 Error: ${error.message}`);
    });
}

const modelsPath = join(__dirname, 'models');
const modelFiles = readdirSync(modelsPath).filter(file => extname(file) === '.js');

for (const file of modelFiles) {
    const data = require(`${modelsPath}/${file}`);
    db[data.name] = data.model;
}

module.exports = db;