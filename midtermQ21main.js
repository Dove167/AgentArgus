// Import the 'fs/promises' module for using file system operations with promises
const fs = require('fs/promises');
//import the os module to access operating system-related utility methods
const os = require('os');
// Get the end-of-line marker for the operating system (e.g., \n for Unix(Linux), \r\n for Windows)
const EOL = os.EOL;

//Define an asynchronous function to read a file and process its contents
async function readAndPackage(filename) {
    try {
        //Read the file's content asynchronously and wait for the operation to complete
        const content = await fs.readFile(filename, 'utf8');
        //Pass the content to the packageData function to convert it into an array of objects
        const data = packageData(content);
        //Group the data by year and write it to a file asynchronously, waiting for the operation to complete
        await groupArtistsByYearAndWrite(data);
        // Log a success message if everything went well
        console.log("Process completed successfully.");
    } catch (err) {
        //Catch and log any errors that occur during file reading or processing
        console.error("Process failed:", err.message);
    }
}

function packageData(content) {
    // Split the content by line breaks and map each line to an object
    return content.split(EOL).map(line => {
        // Skip empty lines or lines that don't contain enough data
        if (!line || line.split(',').length !== 3) return null;

        const [song, name, year] = line.split(',');
        // Check for null values or invalid lines and return only valid data
        return song && name && year ? {
            song: song.trim(),
            name: name.trim(),
            year: parseInt(year.trim(), 10) // Convert year to an integer
        } : null;
    }).filter(item => item !== null); // Remove null values from the array
}


//Define an asynchronous function to group the data by year and write to a JSON file
async function groupArtistsByYearAndWrite(data) {
    //Use reduce to group data by year in one compact operation 
    const groupedData = data.reduce((acc, item) => {
        //convert year to a string for use as a key
        const year =item.year.toString();
        //If the year doesn't exist in the accumulator, initialize it as an empty array
        if (!acc[year]) acc[year] = [];
        //Push the current item (song data) into the array for the respective year
        acc[year].push(item);
        //Reutrn the accumulator for the next iteration
        return acc;

    }, {}); //Initialize the accumulator as an empty object

    //Write the grouped data to a JSON file asynchronously, waiting for the operation to complete
    await fs.writeFile('groupedData.json', JSON.stringify(groupedData, null, 2), 'utf8');
    // Log a success message after writing the file
    console.log("Grouped data written to groupedData.json successfully!");
}

//Start the process by calling the readAndPackage function with the filename 'songs.txt'
readAndPackage('songs.txt');