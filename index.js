const fs = require('fs');
const path = require('path');
const bees = require('./bees.js');
const flowers = require('./flowers.js');

// Get path to APICO from an env var, if not set, default to the absolute path of the directory containing this script
const apicoPath = process.env.APICO_PATH || __dirname;

// Parse APICO's files
const beeData = parseJson(path.join(apicoPath, 'bees.json'));
const dictionaryData = parseJson(path.join(apicoPath, 'dictionary.json'));
const flowerData = parseJson(path.join(apicoPath, 'flowers.json'));

/**
 * Checks if a requested JSON file exists and parses it if it does exist. Exits the program if it doesn't.
 * @param {string} filePath
 */
function parseJson(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`${filePath} was not found! Exiting.`)
        process.exit(1);
    }

    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Process all the bees make a separate .mediawiki template for every bee
bees.process(beeData, dictionaryData);
flowers.process(flowerData);