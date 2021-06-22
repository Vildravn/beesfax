const fs = require('fs');
const path = require('path');
const capitalize = require('lodash.capitalize');
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

// Get path to APICO from an env var, if not set, default to the absolute path of the directory containing this script
const apicoPath = process.env.APICO_PATH || __dirname;

// Parse APICO's files so they're available globally
const bees = parseJson(path.join(apicoPath, 'bees.json'));
const dictionary = parseJson(path.join(apicoPath, 'dictionary.json'));

processBees();

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

/**
 * Processes all the bees in the bees.json file and makes a separate .mediawiki template for every bee.
 */
function processBees() {
    console.info('Processing bees...');
    // Load the template we'll be using to create the wiki pages
    const beeTemplate = compile(fs.readFileSync(path.join(__dirname, 'templates', 'bee.template'), 'utf8'));

    for (var key in bees) {
        const bee = bees[key];

        // Make sure the object is actually a bee
        if (bee.hasOwnProperty("latin")) {
            // Unpack a bee using destructuring
            const { species, latin, tier, desc, hint, product, recipes, lifespan, productivity, fertility, stability, behaviour, climate} = bee;

            let parsedRecipes = [];
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                
                // Parse bee "recipes" (cross-breeding) by pulling data about the breeding outcome bee
                parsedRecipes.push({bee: capitalize(recipe.b), conditions: bees[recipe.s].requirement, outcome: capitalize(recipe.s), chance: bees[recipe.s].chance});
            }
            
            // Create the wiki page using the loaded template
            const templatedBee = resolveToString(beeTemplate, {species: capitalize(species), latin: latin, tier: tier, description: desc[0].text, hint: hint[0].text, special: dictionary[product].name, recipes: parsedRecipes, lifespan: lifespan.join(', '), productivity: productivity.join(', '), fertility: fertility.join(', '), stability: stability.join(', '), behaviour: behaviour.join(', '), climate: climate.join(', ')});
            
            // Create the output path if it doesn't exist
            fs.mkdirSync(path.join(__dirname, 'output', 'bees'), { recursive: true });

            // Write the templated page into a file
            fs.writeFileSync(path.join(__dirname, 'output', 'bees', `${species}.mediawiki`), templatedBee);
        }
    }

    console.info('...Bees processed');
}