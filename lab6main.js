const readlineSync = require('readline-sync');
const { register, createABlog, createPost, likePost } = require('./lab6logic');
const fs = require('fs');
const path = require('path');

// Function to handle user input and save to file
const processInput = async (input) => {
  const [x1, y1, x2, y2] = input.split(' ').map(Number);
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const message = `The distance between your two points: (${x1},${y1}), (${x2},${y2}) is ${distance.toFixed(2)}\n`;

  // Make sure the directory exists, create it if it doesn't
  const dirPath = path.join(__dirname, 'dataPoints');
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }

  // Write the input to points.txt
  await fs.promises.writeFile(path.join(dirPath, 'points.txt'), input + '\n', { flag: 'a' });
  console.log('Content saved');

  // Append the distance message to the file
  await fs.promises.appendFile(path.join(dirPath, 'points.txt'), message);
};

// Main menu
const mainMenu = async () => {
  const action = readlineSync.question('What would you like to do?\n1. Register\n2. Create Blog\n3. Create Post\n4. Like Post\n5. Exit\n');

  switch (action) {
    case '1':
      const username = readlineSync.question('Enter your username: ');
      const password = readlineSync.question('Enter your password: ', { hideEchoBack: true });
      try {
        await register(username, password);
      } catch (error) {
        console.error(error.message);
      }
      break;

    case '2':
      const blogName = readlineSync.question('Enter the blog name: ');
      try {
        await createABlog(blogName);
      } catch (error) {
        console.error(error.message);
      }
      break;

    case '3':
      const blogForPost = readlineSync.question('Enter the blog name: ');
      const postTitle = readlineSync.question('Enter the post title: ');
      const postContent = readlineSync.question('Enter the post content: ');
      try {
        await createPost(postTitle, postContent, blogForPost);
      } catch (error) {
        console.error(error.message);
      }
      break;

    case '4':
      const blogForLike = readlineSync.question('Enter the blog name: ');
      const postForLike = readlineSync.question('Enter the post title: ');
      const usernameForLike = readlineSync.question('Enter your username: ');
      try {
        await likePost(blogForLike, postForLike, usernameForLike);
      } catch (error) {
        console.error(error.message);
      }
      break;

    case '5':
      console.log('Exiting...');
      return;

    default:
      console.log('Invalid option, try again.');
  }

  // Repeat the menu
  await mainMenu();
};

// Start the application
mainMenu();
