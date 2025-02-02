const express = require('express');
const redirect = require('./controllers/redirect.controller');
const url = require('./controllers/shorten.controller');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({Message: 'Hi there'});
});

app.use('/', redirect);
app.use('/api/url', url);

module.exports = app;