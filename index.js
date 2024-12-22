const express = require('express');
    const path = require('path');
    const authRoutes = require('./controllers/authController');
    const storeRoutes = require('./controllers/storeController');
    const programRoutes = require('./controllers/programController');
    const cors = require('cors');

    const app = express();
    const port = 3000;

    app.use(express.json());

    app.use(cors({
      origin: '*', // Replace with your Vue app's URL
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true, // Enable if you send cookies or authorization headers
      exposedHeaders: ['X-File-Info'], 
    }));


    // Routes
    app.use(authRoutes);
    app.use(storeRoutes);
    app.use(programRoutes);

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
