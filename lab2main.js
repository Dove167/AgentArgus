const readlineSync = require("readline-sync");
const { getDayOfTheWeek, makeCalendar } = require("./lab2");

// Generate a full calendar for 2024
console.log("Generating calendar for 2024...");
makeCalendar(2024);

// Function to prompt the user for a date and return the day of the week
function getDayOfTheWeekForUserDate() {
    console.log("\nFind the day of the week for a specific date!");
    const year = readlineSync.questionInt("Enter the year: ");
    const month = readlineSync.questionInt("Enter the month (1-12): ");
    const day = readlineSync.questionInt("Enter the day (1-31): ");

    try {
        const dayOfWeek = getDayOfTheWeek(year, month, day);
        console.log(`The date ${month}-${day}-${year} is a ${dayOfWeek.toLowerCase()}.`);
    } catch (error) {
        console.log("Invalid date. Please try again.");
    }
}

// Ask the user for a date
getDayOfTheWeekForUserDate();
