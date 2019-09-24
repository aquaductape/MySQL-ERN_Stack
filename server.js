const express = require('express');

const app = express();

const port = process.env.PORT || 5000;

// Init Middleware
app.use(express.json({ extended: false }));

app.listen(port, () => console.log(`Listening port ${port}... 👁️ `));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
