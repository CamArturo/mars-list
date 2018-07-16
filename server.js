const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.get('/', (request, response) => {

});