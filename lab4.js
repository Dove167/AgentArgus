const fs = require("fs").promises;
const readlineSync = require("readline-sync");
const { EOL } = require("os");

// Utility Functions
const square = (num) => num * num;

const squareRoot = (num) => Math.sqrt(num);

const distance = (x1, y1, x2, y2) => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return squareRoot(square(deltaX) + square(deltaY));
};

// Function to process input and calculate distances
const processInput = async (x1, y1, x2, y2, filePath) => {
    const pointsContent = `Points: (${x1}, ${y1}), (${x2}, ${y2})${EOL}`;
    const dist = distance(x1, y1, x2, y2).toFixed(2);
    const distanceContent = `The distance between your two points: (${x1},${y1}), (${x2},${y2}) is ${dist}${EOL}`;

    try {
        // Append points and distance to file
        await fs.appendFile(filePath, pointsContent + distanceContent);
        console.log("Content saved and distance calculated!");
    } catch (err) {
        console.error("Error writing to file:", err);
    }
};

// Main Program
const lab4 = async () => {
    // Create `dataPoints` directory
    const dirPath = "dataPoints";
    const filePath = `${dirPath}/points.txt`;

    try {
        // Ensure the directory exists
        await fs.mkdir(dirPath, { recursive: true });
    } catch (err) {
        console.error("Error creating directory:", err);
        return;
    }

    // Infinite loop for user input
    while (true) {
        const userInput = readlineSync.question(
            "Enter points (x1 y1 x2 y2) or type 'cancel' to exit: "
        );

        if (userInput.toLowerCase() === "cancel") {
            console.log("Program terminated. Goodbye!");
            break;
        }

        const points = userInput.split(" ").map(Number);

        if (points.length !== 4 || points.some(isNaN)) {
            console.log("Invalid input. Please enter 4 numbers separated by spaces.");
            continue; // Retry
        }

        const [x1, y1, x2, y2] = points;

        // Process the input and write to file
        await processInput(x1, y1, x2, y2, filePath);
    }
};

lab4();
