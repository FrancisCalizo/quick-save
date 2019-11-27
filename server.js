const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Datebase
connectDB();

app.get('/', (req, res) => res.json({ msg: 'Welcome to Quick Save' }));

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`));
