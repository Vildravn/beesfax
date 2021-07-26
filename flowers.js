const fs = require('fs');
const path = require('path');
const capitalize = require('lodash.capitalize');
const compile = require('es6-template-strings/compile');
const resolveToString = require('es6-template-strings/resolve-to-string');

/**
 * Processes all the flowers in the flowers.json file and makes a separate .mediawiki template for every flower.
 */
 exports.process = function(flowerData) {
    console.info('Processing flowers...');
    // Load the template we'll be using to create the wiki pages
    const template = compile(fs.readFileSync(path.join(__dirname, 'templates', 'flower.template'), 'utf8'));

    for (var key in flowerData) {
        const flower = flowerData[key];

        // Make sure the object is actually a flower
        if (flower.hasOwnProperty("latin")) {
            // Unpack a flowe using destructuring
            const { species, latin, tier, desc, hint, recipes, effect, effect_desc, aquatic, smoker} = flower;

            let parsedRecipes = [];
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                
                const bIndex = recipe.b.replace('flower', '');
                const sIndex = recipe.s.replace('flower', '');

                // Parse flower "recipes" (cross-breeding)
                parsedRecipes.push({flower: flowerData[bIndex].species, outcome: flowerData[sIndex].species});
            }

            // Create the wiki page using the loaded template
            const templatedFlower = resolveToString(template, {species: species, latin: latin, tier: tier, description: desc[0].text, hint: hint[0].text, recipes: parsedRecipes, aquatic: aquatic, effect: effect, effect_description: effect_desc[0].text, smoker: smoker.join(', ')});
            
            // Create the output path if it doesn't exist
            fs.mkdirSync(path.join(__dirname, 'output', 'flowers'), { recursive: true });

            // Write the templated page into a file
            fs.writeFileSync(path.join(__dirname, 'output', 'flowers', `${species}.mediawiki`), templatedFlower);
        }
    }

    console.info('...Flowers processed');
}