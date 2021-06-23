const fs = require('fs');
const path = require('path');
const capitalize = require('lodash.capitalize');
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

/**
 * Processes all the bees in the bees.json file and makes a separate .mediawiki template for every bee.
 */
 exports.process = function(beeData, dictionaryData) {
    console.info('Processing bees...');
    // Load the template we'll be using to create the wiki pages
    const beeTemplate = compile(fs.readFileSync(path.join(__dirname, 'templates', 'bee.template'), 'utf8'));

    for (var key in beeData) {
        const bee = beeData[key];

        // Make sure the object is actually a bee
        if (bee.hasOwnProperty("latin")) {
            // Unpack a bee using destructuring
            const { species, latin, tier, desc, hint, product, recipes, lifespan, productivity, fertility, stability, behaviour, climate} = bee;

            let parsedRecipes = [];
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                
                // Parse bee "recipes" (cross-breeding) by pulling data about the breeding outcome bee
                parsedRecipes.push({bee: capitalize(recipe.b), conditions: beeData[recipe.s].requirement, outcome: capitalize(recipe.s), chance: beeData[recipe.s].chance});
            }
            
            // Create the wiki page using the loaded template
            const templatedBee = resolveToString(beeTemplate, {species: capitalize(species), latin: latin, tier: tier, description: desc[0].text, hint: hint[0].text, special: dictionaryData[product].name, recipes: parsedRecipes, lifespan: lifespan.join(', '), productivity: productivity.join(', '), fertility: fertility.join(', '), stability: stability.join(', '), behaviour: behaviour.join(', '), climate: climate.join(', ')});
            
            // Create the output path if it doesn't exist
            fs.mkdirSync(path.join(__dirname, 'output', 'bees'), { recursive: true });

            // Write the templated page into a file
            fs.writeFileSync(path.join(__dirname, 'output', 'bees', `${species}.mediawiki`), templatedBee);
        }
    }

    console.info('...Bees processed');
}