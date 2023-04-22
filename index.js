require("dotenv").config();
const cors = require('cors');
const express = require('express');
const sanitizerMiddleware = require ('./app/middlewares/sanitizer');
const multer  = require('multer');

const bodyParser = multer();

const app = express();

app.use(cors());

app.use( bodyParser.none() );

app.use(express.urlencoded({ extended: true }));

app.use(sanitizerMiddleware);

app.use(express.static('public'));

const router = require ("./app/router");

const PORT = process.env.PORT || 5000;


app.use(router);

app.listen(PORT, () => {
  console.log(`Okanban REST API listening on port ${PORT}`)
})