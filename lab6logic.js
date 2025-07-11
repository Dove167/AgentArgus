const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

// Helper function to check if user exists
const userExists = async (username) => {
  const data = await fs.promises.readFile('databaselab6.txt', 'utf8');
  const users = data.split('\n').filter(line => line.trim() !== '');
  return users.includes(username);
};

// Register a new user
const register = async (username, password) => {
  if (await userExists(username)) {
    throw new Error('User already exists');
  }
  await fs.promises.appendFile('databaselab6.txt', `${username}:${password}\n`);
  console.log('User registered successfully');
};

// Create a new blog
const createABlog = async (blogName) => {
  const blogPath = path.join(__dirname, blogName);
  if (fs.existsSync(blogPath)) {
    throw new Error('Blog already exists. Choose a different name.');
  }
  await fs.promises.mkdir(blogPath);
  console.log(`Blog "${blogName}" created successfully.`);
};

// Create a new post
const createPost = async (postTitle, postContent, blogName) => {
  const blogPath = path.join(__dirname, blogName);
  if (!fs.existsSync(blogPath)) {
    throw new Error(`Blog "${blogName}" does not exist.`);
  }
  
  // Replace spaces in postTitle with underscores
  let fileName = postTitle.replace(/\s+/g, '_') + '.txt';
  let filePath = path.join(blogPath, fileName);
  let counter = 1;
  
  // Check if file exists, and if so, add a counter to the filename to make it unique
  while (fs.existsSync(filePath)) {
    fileName = `${postTitle.replace(/\s+/g, '_')}_${counter}.txt`;
    filePath = path.join(blogPath, fileName);
    counter++;
  }
  
  // Write the post content to the file
  const postContentFormatted = `---\n\nlikes:1\n\nlikedBy: you\n\n${postContent}\n\n---`;
  await fs.promises.writeFile(filePath, postContentFormatted);
  console.log(`Post "${postTitle}" created successfully in blog "${blogName}".`);
};

// Like a post
const likePost = async (blogName, postTitle, username) => {
  if (!(await userExists(username))) {
    throw new Error('User does not exist.');
  }

  const blogPath = path.join(__dirname, blogName);
  if (!fs.existsSync(blogPath)) {
    throw new Error(`Blog "${blogName}" does not exist.`);
  }

  let fileName = postTitle.replace(/\s+/g, '_') + '.txt';
  let filePath = path.join(blogPath, fileName);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post "${postTitle}" does not exist in blog "${blogName}".`);
  }

  const postData = await fs.promises.readFile(filePath, 'utf8');
  const lines = postData.split('\n');
  
  // Update the likes and likedBy section
  const likeLineIndex = lines.findIndex(line => line.startsWith('likes:'));
  const likedByLineIndex = lines.findIndex(line => line.startsWith('likedBy:'));
  
  if (likeLineIndex !== -1 && likedByLineIndex !== -1) {
    const likesLine = lines[likeLineIndex];
    const likedByLine = lines[likedByLineIndex];
    const currentLikes = parseInt(likesLine.split(':')[1].trim()) + 1;
    const updatedLikedBy = `${likedByLine}, ${username}`;
    
    // Update the lines
    lines[likeLineIndex] = `likes:${currentLikes}`;
    lines[likedByLineIndex] = updatedLikedBy;

    // Save the updated content back to the file
    await fs.promises.writeFile(filePath, lines.join('\n'));
    console.log(`Post "${postTitle}" liked by "${username}".`);
  } else {
    throw new Error('Error updating the post.');
  }
};

module.exports = { register, createABlog, createPost, likePost };
