const inquirer = require("inquirer");
const fs = require("fs/promises");
const path = require("path");

// Load snippets from the JSON file
async function getCodeSnippets() {
  const data = await fs.readFile(path.join(__dirname, "codeSnippets.json"), "utf8");
  return JSON.parse(data);
}

// Function to view snippets by category
async function viewSnippetsByCategory() {
  const { category } = await inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: "Choose a category to view:",
      choices: ["functions", "loops", "dataStructures", "errorHandling"]
    }
  ]);

  const snippets = await getCodeSnippets();
  const categorySnippets = snippets[category];

  console.log(`\nViewing snippets from the '${category}' category:\n`);
  categorySnippets.forEach(snippet => {
    console.log(`Name: ${snippet.name}`);
    console.log(`Code: ${snippet.code}`);
    console.log(`Description: ${snippet.description}`);
    console.log(`Tags: ${snippet.tags.join(", ")}`);
    console.log(`Difficulty: ${snippet.difficulty}`);
    console.log(`Use case: ${snippet.useCase}`);
    console.log("-------------");
  });
}

// Function to search for snippets by tag
async function searchSnippetsByTag() {
  const { tag } = await inquirer.prompt([
    {
      type: "input",
      name: "tag",
      message: "Enter a tag to search for (e.g., function, loop, ES6):"
    }
  ]);

  const snippets = await getCodeSnippets();
  const matchingSnippets = [];

  // Search through all snippets and check if they contain the tag
  for (const category in snippets) {
    snippets[category].forEach(snippet => {
      if (snippet.tags.includes(tag)) {
        matchingSnippets.push(snippet);
      }
    });
  }

  if (matchingSnippets.length > 0) {
    console.log(`\nSnippets matching the tag '${tag}':\n`);
    matchingSnippets.forEach(snippet => {
      console.log(`Name: ${snippet.name}`);
      console.log(`Code: ${snippet.code}`);
      console.log(`Description: ${snippet.description}`);
      console.log("-------------");
    });
  } else {
    console.log(`No snippets found for the tag '${tag}'`);
  }
}

// Function to quiz the user on a code snippet
async function quizMode() {
  const snippets = await getCodeSnippets();
  const snippetChoices = [];

  // Create a list of snippet names for quiz mode
  for (const category in snippets) {
    snippets[category].forEach(snippet => {
      snippetChoices.push(snippet.name);
    });
  }

  const { snippetName } = await inquirer.prompt([
    {
      type: "list",
      name: "snippetName",
      message: "Select a snippet to quiz yourself on:",
      choices: snippetChoices
    }
  ]);

  const snippet = snippets[snippetName];
  const { answer } = await inquirer.prompt([
    {
      type: "input",
      name: "answer",
      message: `What does this snippet do?\n${snippet.code}\nYour answer:`
    }
  ]);

  console.log(`Your answer: ${answer}`);
  console.log(`Correct behavior: ${snippet.description}`);
}

// Function to randomly display a snippet
async function randomSnippet() {
  const snippets = await getCodeSnippets();
  const allSnippets = [];

  // Gather all snippets into a single array
  for (const category in snippets) {
    allSnippets.push(...snippets[category]);
  }

  const randomSnippet = allSnippets[Math.floor(Math.random() * allSnippets.length)];
  console.log(`\nRandom snippet:\nName: ${randomSnippet.name}`);
  console.log(`Code: ${randomSnippet.code}`);
  console.log(`Description: ${randomSnippet.description}`);
  console.log("-------------");
}

// Main function to interact with the user
async function main() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "View snippets by category",
        "Search snippets by tag",
        "Quiz yourself",
        "Random code snippet",
        "Exit"
      ]
    }
  ]);

  switch (action) {
    case "View snippets by category":
      await viewSnippetsByCategory();
      break;
    case "Search snippets by tag":
      await searchSnippetsByTag();
      break;
    case "Quiz yourself":
      await quizMode();
      break;
    case "Random code snippet":
      await randomSnippet();
      break;
    case "Exit":
      console.log("Goodbye!");
      return;
  }

  await main(); // Re-run the menu
}

main();
