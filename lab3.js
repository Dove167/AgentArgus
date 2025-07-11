const { distance } = require('./lab3Math');
const fs = require('fs');
const path = require('path');

// Function to process input
function processInput(input) {
    const dataDir = path.join(__dirname, 'dataPoints');
    const filePath = path.join(dataDir, 'points.txt');
    
    // Ensure the folder exists
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    
    // Write user input to file
    const userInput = input.join(' ');
    fs.writeFileSync(filePath, userInput);
    console.log('Content saved');
    
    // Calculate distance
    const [x1, y1, x2, y2] = input.map(Number);
    const dist = distance(x1, y1, x2, y2);
    
    // Append distance calculation to file
    const distanceMessage = `The distance between your two points: (${x1},${y1}), (${x2},${y2}) is ${dist}`;
    fs.appendFileSync(filePath, `\n${distanceMessage}`);
}

// Main logic
const args = process.argv.slice(2); // Get user input
if (args.length === 4) {
    processInput(args);
} else {
    console.error('Please provide exactly four arguments (x1, y1, x2, y2).');
}
