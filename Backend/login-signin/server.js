const express = require('express');
const { urlencoded, json } = require('body-parser');
const { connect, Schema, model } = require('mongoose');
const argon2 = require('argon2');
const cors = require('cors'); // Import cors module
const app = express();
const port = 3001;
require('dotenv').config();

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

connect(process.env.MONGODB_URI);

const isPasswordValid = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=]).{8,}$/;
    return passwordRegex.test(password);
};

const userSchema = new Schema({
    username: String,
    password: String,
    firstName: String,
    lastName: String,
    email: String,
});

const User = model('User', userSchema);

app.post('/signup', async (req, res) => {
    try {
        const { username, password, firstName, lastName, email } = req.body;
        if (!username || !firstName || !lastName) {
            return res.status(400).send('Name and username are required fields');
        }
        if (!isPasswordValid(password)) {
            return res.status(400).send('Password must be at least 8 characters and contain 1 uppercase, 1 lowercase, 1 symbol, and 1 digit');
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('Username already taken');
        }

        const hashedPassword = await argon2.hash(password); // Use argon2 for hashing
        const newUser = new User({ username, password: hashedPassword, firstName, lastName, email });
        await newUser.save();
        res.send('Signup successful');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (user) {
            const isPasswordValid = await argon2.verify(user.password, password); // Use argon2 for verification
            if (isPasswordValid) {
                res.send('Login successful');
            } else {
                res.status(401).send('Invalid credentials');
            }
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
    