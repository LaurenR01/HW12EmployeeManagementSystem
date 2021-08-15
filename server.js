const express = require('express');
const fs = require('fs');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT || 3001;
const inquirer = require('inquirer');
const mainMenu = require('./scripts/prompts');
const path = require('path');

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT} `);
    mainMenu();
});

module.exports = express