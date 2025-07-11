// Import Math module
const Math = require('math');
//Make sure to install npm install math

// Helper function: squareRoot
function squareRoot(value) {
    return Math.sqrt(value);
}

// Helper function: square
function square(value) {
    return value * value;
}

// Function: distance
function distance(x1, y1, x2, y2) {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return squareRoot(square(deltaX) + square(deltaY));
}

// Export distance
module.exports = { distance };
