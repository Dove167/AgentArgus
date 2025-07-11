// Functions to calculate the day of the week
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

function getDayOfTheWeek(year, month, day) {
    const monthCodes = [0, 3, 3, 6, 1, 4, 6, 2, 5, 0, 3, 5];
    let yearCode = (year % 100);
    const centuryCodeMap = { 16: 6, 17: 4, 18: 2, 19: 0, 20: 6, 21: 4 };

    yearCode = Math.floor(yearCode / 4) + yearCode;
    const monthCode = monthCodes[month - 1];
    const centuryCode = centuryCodeMap[Math.floor(year / 100)] || 0;

    let leapYearAdjustment = 0;
    if (isLeapYear(year) && (month === 1 || month === 2)) {
        leapYearAdjustment = -1;
    }

    const total = yearCode + monthCode + centuryCode + day + leapYearAdjustment;
    const dayCode = total % 7;

    const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    return days[dayCode];
}

function makeCalendar(year) {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (isLeapYear(year)) {
        daysInMonth[1] = 29;
    }

    for (let month = 1; month <= 12; month++) {
        for (let day = 1; day <= daysInMonth[month - 1]; day++) {
            const dayOfWeek = getDayOfTheWeek(year, month, day);
            console.log(`${month}-${day}-${year} is a ${dayOfWeek.toLowerCase()}`);
        }
    }
}

module.exports = { getDayOfTheWeek, makeCalendar };
