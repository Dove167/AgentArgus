// Helper functions (Larva)
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}

// Main program (Virulence + Parasitic Link)
var listOfTemperatures = ["13c", "23c", "12c", "57f", "69f", "30c"];

var convertedTemperatures = listOfTemperatures.map(temp => {
    let value = parseFloat(temp.slice(0, -1)); // Extract number
    let unit = temp.slice(-1);                // Extract unit ('c' or 'f')

    if (unit === 'c') {
        // Convert Celsius to Fahrenheit
        return celsiusToFahrenheit(value).toFixed(2) + 'f';
    } else if (unit === 'f') {
        // Convert Fahrenheit to Celsius
        return fahrenheitToCelsius(value).toFixed(2) + 'c';
    } else {
        // Handle unexpected cases
        return 'Invalid temperature';
    }
});

console.log(convertedTemperatures);
