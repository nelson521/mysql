let mysql = require("mysql");
let inquirer = require("inquirer");

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
    promptCustomerForItem(res)

  })
});

function loadProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if(err) throw err;
    console.log(res);
    promptCustomerForItem(res);
   })
}

function promptCustomerForItem(inventory) {
  inquirer
  .prompt([
    {
      type: "input",
      name: "choice", 
      message: "what is the id you want?",
      validate: function(val) {
        return !isNaN(val) || val.toLowerCase() === "q";
      }
    }
  ])
  .then(function(val) {
    
    checkIfShouldExit(val.choice);
    var choiceId = parseInt(val.choice);
    var product = checkInventory(choiceId, inventory);

    
    if (product) {
      
      promptCustomerForQuantity(product);
    }
    else {
      
      console.log("\nThat item is not in the inventory.");
      loadProducts();
    }
  });

}

function checkIfShouldExit(choice) {
  if(choice === 'q') {
    console.log("goodbye");
    process.exit(0);
  }
}

function checkInventory(choiceId, inventory) {
  for(let i = 0; i < inventory.length; i++) {
    if(choiceId === inventory[i].item_id) {
      return inventory[i];
    }
  }
}

function promptCustomerForQuantity(product) {
  inquirer
  .prompt([
    {
      type: "input",
      name: "quantity",
      message: "How manY?? [quit with q]",
      validate: function(val) {
        return val > 0 || val.toLowerCase() === 'q';
      }
    }
  ])
  .then(function(val) {
    
    checkIfShouldExit(val.quantity);
    var quantity = parseInt(val.quantity);

    
    if (quantity > product.stock_quantity) {
      console.log("\nInsufficient quantity!");
      loadProducts();
    }
    else {
      
      makePurchase(product, quantity);
    }
  });

}

function makePurchase(product, quantity) {
  connection.query(
    "update products set stock quentity = stock_ quantity - ? where item_id ?", [quantity, product.item_id], 
    function(err , res) {
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!"); loadProducts();
    }
  )
}

function checkInventory(choiceId, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].item_id === choiceId) {
      
      return inventory[i];
    }
  }
  return null;
}

function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {

    console.log("Goodbye!");
    process.exit(0);
  }
}





  



// function question(prompt, response){
//   const response = await prompts({
//     type: 'text',
//     name: 'id',
//     message: 'What is the ID of the product ?'
//   });
// }

// question(response.message);

