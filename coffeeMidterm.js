const fs = require('fs-extra');
const inquirer = require('inquirer');
const { EOL } = require('os');

// Coffee types mapping
const coffeeMap = {
    MR: "medium-roast",
    B: "blonde",
    DR: "dark-roast"
};

// Validate and get coffee type
const getCoffeeType = (type) => {
    const coffeeType = coffeeMap[type.toUpperCase()];
    if (!coffeeType) throw new Error("Invalid coffee type.");
    return coffeeType;
};

// Read and modify supply file
const modifySupply = async (type, modifyFunc) => {
    const content = await fs.readFile('supply.txt', 'utf8');
    const lines = content.split(EOL);
    const updatedLines = modifyFunc(lines, type);
    await fs.writeFile('supply.txt', updatedLines.join(EOL));
};

// View supply count
async function viewSupply(coffeeType) {
    const type = getCoffeeType(coffeeType);
    const content = await fs.readFile('supply.txt', 'utf8');
    const count = content.split(EOL).filter(line => line === type).length;
    console.log(`\nThere are ${count} units of ${type} in supply.`);
}

// Add to supply
async function addSupply(coffeeType, quantity = 1) {
    const type = getCoffeeType(coffeeType);
    const newSupply = Array(quantity).fill(type).join(EOL) + EOL;
    await fs.appendFile('supply.txt', newSupply);
    console.log(`\nAdded ${quantity} units of ${type} to supply.`);
}

// Delete from supply
async function deleteSupply(coffeeType, quantity) {
    const type = getCoffeeType(coffeeType);
    await modifySupply(type, (lines, type) => {
        if (quantity === '*') return lines.filter(line => line !== type);
        let count = 0;
        return lines.filter(line => {
            if (line === type && count < quantity) {
                count++;
                return false;
            }
            return true;
        });
    });
    console.log(`\nDeleted ${quantity === '*' ? 'all' : quantity} units of ${type} from supply.`);
}

// Prompt helper function
const promptUser = async (message, choices) => {
    const { response } = await inquirer.prompt({
        name: 'response',
        type: 'list',
        message,
        choices
    });
    return response;
};

// Main menu loop
async function mainMenu() {
    while (true) {
        const choice = await promptUser('Choose an option:', [
            { name: 'View Supply', value: 'view' },
            { name: 'Add Supply', value: 'add' },
            { name: 'Delete Supply', value: 'delete' },
            { name: 'Exit', value: 'exit' }
        ]);

        if (choice === 'exit') {
            console.log("\nGoodbye!");
            break;
        }

        try {
            const coffeeType = await promptUser('Choose a coffee type:', [
                { name: 'Medium Roast (MR)', value: 'MR' },
                { name: 'Blonde (B)', value: 'B' },
                { name: 'Dark Roast (DR)', value: 'DR' }
            ]);

            if (choice === 'view') {
                await viewSupply(coffeeType);
            } else if (choice === 'add') {
                const { quantity } = await inquirer.prompt({
                    name: 'quantity',
                    type: 'number',
                    message: 'How many units would you like to add?',
                    default: 1
                });
                await addSupply(coffeeType, quantity);
            } else if (choice === 'delete') {
                const { quantity } = await inquirer.prompt({
                    name: 'quantity',
                    type: 'input',
                    message: 'How many units would you like to delete? (Enter "*" to delete all)',
                    default: '*'
                });
                await deleteSupply(coffeeType, quantity === '*' ? '*' : parseInt(quantity, 10));
            }
        } catch (err) {
            console.error("\nError:", err.message);
        }
    }
}

// Run the main menu
mainMenu();
