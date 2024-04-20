const express = require('express'); //easily define routes, handle HTTP requests and responses, and set up middleware to enhance the functionality of their Node.js applications
const mongoose = require('mongoose');//Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a straightforward schema-based solution for modeling application data and includes features for defining models, creating queries, and interacting with MongoDB databases.
const bcrypt = require('bcryptjs');//bcryptjs uses a strong hashing algorithm (bcrypt) and includes features for generating hashed passwords and comparing hashed passwords with plain-text passwords to verify user credentials.
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/crudapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Login Route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: 'User not found' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user._id }, 'secret');
  res.json({ token });
});

// Register Route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.json({ message: 'User registered successfully' });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  jwt.verify(token, 'secret', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decoded.userId;
    next();
  });
};

// Protected Route
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: 'Welcome to the dashboard' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
