const fs = require("fs/promises");

const processCSV = async () => {
    try {
        // Read the CSV file
        const data = await fs.readFile("menu.csv", "utf-8");
        
        // Split the CSV content into rows
        const rows = data.split("\n");
        
        // Initialize an object to group menu items by category
        const menu = {};

        rows.forEach((row) => {
            // Split each row by comma to extract details
            const [category, name, quantity, price] = row.split(",");
            
            // Ensure all values are present
            if (!category || !name || !quantity || !price) return;

            // Calculate new price with additional charge
            const originalPrice = parseFloat(price.slice(1)); // Remove '$' and convert to float
            const newPrice = (originalPrice * 1.8).toFixed(2);

            // Add to the menu object
            if (!menu[category]) menu[category] = [];
            menu[category].push(`$${newPrice} ${name}, ${quantity.trim()}`);
        });

        // Construct the menu text
        let menuText = "";
        for (const [category, items] of Object.entries(menu)) {
            menuText += `* ${category.charAt(0).toUpperCase() + category.slice(1)} Items *\n`;
            items.forEach((item) => {
                menuText += `${item}\n`;
            });
            menuText += "\n"; // Add spacing between categories
        }

        // Write to the menu.txt file
        await fs.writeFile("menu.txt", menuText);
        console.log("Menu has been successfully written to menu.txt");
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
};

// Run the function
processCSV();
