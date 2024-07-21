const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const authRoutes = require('./routes/authRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferenceRoutes);

app.listen(port, () => {
  console.log(`Express server running at http://localhost:3000`);
});
