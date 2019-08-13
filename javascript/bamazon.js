let mysql = require("mysql");
let inquirer = require("inquirer");
let prompt = require('prompt');

let connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "password",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  connection.query('select * from products', function (err, res) {
    console.log(res);

  })
});

function question(prompt, response){
  const response = await prompts({
    type: 'text',
    name: 'id',
    message: 'What is the ID of the product ?'
  });
}

question(response.message);

