var util = require('util');
var mysql = require('mysql');
var returnValue;
//******************************************
//Function for the data base

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '1234',
    database : 'fis_assignment2'
});

connection.connect();

function runSqlQuery(sql, callback) {
    
    connection.query(sql, function (err, rows, fields) {
        if (err) { console.log('Error ' + err); initializeMenu(); };
        
        callback(null, rows, fields);
	
    });
};

//*****************************************
// Take Input


//*********************
//Menu handling functions
//*********************

//global variable, which will be reinitialized as function within menus, for handling user input

//initializeMenu function is the starting point of menu
function initializeMenu() {
    
    showMainMenu();
    process.stdin.setEncoding('utf8');
    //assign callback for handling user input
    process.stdin.once('data', function (data) {
        
        var input = data.toString().trim();
        var inputArray = new Array();
        //var input = process.stdin.read();
        if (input !== null) {

            //split input into array
            
            if (input.match(/'/g)) {
                testArray = input.split("'");
                var count = input.match(/'/g).length;
                //console.log(testArray);
                for (var i = 0; i < testArray.length; i++) {
                    
                    if (testArray[i] != '') {
                        testArray[i] = testArray[i].trim();
                        var token = new Array();
                        if (i % 2 == 0) {
                            token = testArray[i].split(' ');
                        }
                        else {
                            token.push(testArray[i]);
                        }
                        //var token = testArray[i].split(' ');
                        for (var j = 0; j < token.length; j++) {
                            if (token[j] != '') {
                                inputArray.push(token[j]);
                            }

                        }
                    }
                };
            }
            else {
                inputArray = input.split(' ');
            }
            //menuHandler takes input array as an input
            menuHandler(inputArray);
        }
    });
    
}



// Main menu
function showMainMenu() {
    console.log(
        '\n\n' +
        '****************Main manu****************' + '\n' +
        'Invoking command syntax: \'operation_number_or_word\' \'input_values\'' + '\n' +
        '1 - Add new order with order details for existing customer. Input values: \'customerId\'' + '\n' +
        '2 - Add new customer with customer account. Input values: \'name\' \'phone\' \'address\' \'city\' \'country\'' + '\n' +
		'3 - Delete order with all order details. Input Values: \'order_id\'' + '\n' +
		'4 - Delete customer details. Input Values: \'customer_id\'' + '\n' +
		'5 - Get total sum of order. Input Values: \'order_id\'' + '\n' +
		'6 - Get client name and total sum of all orders for this client. Input Values: \'client_id\'' + '\n' +
        'exit - Exit' + '\n'
    );
};

function menuHandler(input) {
    //switch takes into consideration first element of an array
    switch (input[0]) {
        case '1':
            if (input.length == 2) {
                var sqlQuery = "SELECT customers.id  FROM customers  WHERE customers.id = " + input[1];
                runSqlQuery(sqlQuery, function (err, rows, fields) {
                    if (err) { console.log('Error ' + err); initializeMenu(); };
                    
                    if (rows[0] != null) {
                        sqlQuery = 'insert into orders(customer_id) values(' + input[1] + ');';
                        runSqlQuery(sqlQuery, function reRunQuery(err, rows, fields) {
                            if (err) { console.log('Error ' + err); initializeMenu(); };
                            sqlQuery = "SELECT MAX(id) as maxid FROM orders;";
                            runSqlQuery(sqlQuery, function (err, rows, fields) {
                                if (err) { console.log('Error ' + err); initializeMenu(); };
                                
                                var currentOrder = rows[0].maxid;
                                
                                console.log(
                                    '\n\n' +
                            '\t-------------Submenu create new account for customer with orderId = ' + currentOrder + '--------------\n' +
                            '\tEnter input variables: \'item_id\' \'price_per_item\' \'quantity\'\n' +
                            '\tmain - Exit to main menu\n\n' 
                                );
                                
                                process.stdin.setEncoding('utf8');
                                process.stdin.once('data', function (data) {
                                    var input = data.toString().trim();
                                    if (input !== null) {
                                        
                                        //split input into array by whitespace
                                        inputArray = input.split(' ');
                                        
                                        if (inputArray[0] == "main") {
                                            initializeMenu();
                                        }
                                        else if (inputArray.length == 3) {
                                            sqlQuery = "INSERT INTO order_details(order_id, item_id, price_per_item, quantity) VALUES(" + currentOrder + "," + inputArray[0] + "," + inputArray[1] + "," + inputArray[2] + ");";
                                            runSqlQuery(sqlQuery, function (err, rows, fields) {
                                                if (err) { console.log('Error ' + err); reRunQuery(err, rows, fields); };
                                                //console.log('I am successful');
                                                reRunQuery(err, rows, fields);
                                            
                                            });
                                        }
                                        else {
                                            console.log('Syntax for enterinng order details is: \'item_id\' \'price_per_item\' \'quantity\'');
                                            reRunQuery(err, rows, fields);
                                        }
                                    }
                                });
                            });
                        });
                    }
                    else {
                        console.log('Customer with id = ' + input[1] + ' does not exist; New order is not inserted');
                        initializeMenu();
                    }
                });
            }
            else {
                console.log("Syntax for entering customer_id is: 1 'customer_id'");
                initializeMenu();
            }
            break;
            
        case '2':
            if (input.length == 6) {
                
                var sqlQuery = "insert into customers(name, phone, address, city, country) values('" + input[1] + "','" + input[2] + "','" + input[3] + "','" + input[4] + "','" + input[5] + "');";
                runSqlQuery(sqlQuery, function (err, rows, fields) {
                    if (err) { console.log('Error ' + err); initializeMenu(); };
                    
                    sqlQuery = "SELECT MAX(id) as maxid FROM customers;";
                    runSqlQuery(sqlQuery, function reTakeInput(err, rows, fields) {
                        if (err) { console.log('Error ' + err); initializeMenu(); };
                        var currentCustomer = rows[0].maxid;
                        console.log('Inserted new customer. The id of new customer is: ' + currentCustomer);
                        
                        console.log(
                            '\n\n' +
                            '\t-------------Submenu create new account for customer with id = ' + currentCustomer + '--------------\n' +
                            '\tEnter input variables: \'user_name\' \'password\'\n\n'
                        );
                        
                        process.stdin.setEncoding('utf8');
                        process.stdin.once('data', function (data) {
                            var input = data.toString().trim();
                            
                            if (input !== null) {
                                
                                inputArray = input.split(' ');
                                
                                if (inputArray.length != 2) {
                                    console.log('Invalid user_name or password entered. Enter Again');
                                    reTakeInput(err, rows, fields);
                                }
                                else {
                                    sqlQuery = "insert into customer_accounts(customer_id, user_name, password) values(" + currentCustomer + ", '" + input[0] + "', '" + input[1] + "');";
                                    runSqlQuery(sqlQuery, function (err, rows, fields) {
                                        if (err) { console.log('Error ' + err); initializeMenu(); };
                                        console.log('\tSuccessfully added new account details for customer with id = ' + currentCustomer);
                                        initializeMenu();
                                    });
                                }
                            }
                        });

                    });
                });
            }
            else {
                console.log('Syntax for enterinng customer account is: 2 \'name\' \'phone\' \'address\' \'city\' \'country\'');
                initializeMenu();
            }
            break;
        case '3':
            if (input.length == 2) {
                sqlQuery = "DELETE FROM orders WHERE id = " + input[1];
                runSqlQuery(sqlQuery, function (err, rows, fields) {
                    if (err) { console.log('Error ' + err); initializeMenu(); };
                    
                    sqlQuery = "DELETE FROM order_details WHERE order_id = " + input[1];
                    runSqlQuery(sqlQuery, function (err, rows, fields) {
                        if (err) { console.log('Error ' + err); initializeMenu(); };
                        
                        console.log('order number ' + input[1] + ' deleted');
                        initializeMenu();
                    });
                });
            }
            else {
                console.log('Syntax for deleting order is: 3 \'order_id\'');
                initializeMenu();
            }
            break;
        case '4':
            if (input.length == 2) {
                sqlQuery = "DELETE FROM customers WHERE id = " + input[1];
                runSqlQuery(sqlQuery, function (err, rows, fields) {
                    if (err) { console.log('Error ' + err); initializeMenu(); };
                    
                    sqlQuery = "DELETE FROM customer_accounts WHERE customer_id = " + input[1];
                    runSqlQuery(sqlQuery, function (err, rows, fields) {
                        if (err) { console.log('Error ' + err); initializeMenu(); };
                        
                        console.log('customer details with customer_id ' + input[1] + ' deleted');
                        initializeMenu();
                    });
                });
            }
            else {
                console.log('Syntax for deleting customer is: 4 \'customer_id\'');
                initializeMenu();
            }
            break;
        case '5':
            if (input.length == 2) {
                sqlQuery = "SELECT SUM(price_per_item * quantity) as total FROM order_details WHERE order_id = " + input[1];
                runSqlQuery(sqlQuery, function (err, rows, fields) {
                    if (err) { console.log('Error ' + err); initializeMenu(); };
                    
                    if (rows[0].total != null) {
                        console.log('The sum of order with order_id = ' + input[1] + ' is ' + rows[0].total);
                        initializeMenu();
                    }
                    else {
                        console.log('Order with order_id = ' + input[1] + ' does not exist');
                        initializeMenu();
                    }
                });
            }
            else {
                console.log('Syntax to get the total sum of order is: 5 \'order_id\'');
                initializeMenu();
            }
            break;
        case '6':
            if (input.length == 2) {
                sqlQuery = "SELECT customers.name as name from customers where id =" + input[1];
                runSqlQuery(sqlQuery, function (err, rows, fields) {
                    if (err) { console.log('Error ' + err); initializeMenu(); };
                    
                    
                    if (rows[0] != null) {
                        var customerName = rows[0].name;
                        sqlQuery = "SELECT SUM(price_per_item * quantity) AS total FROM orders, order_details WHERE orders.customer_id = " + input[1] + " AND orders.id = order_details.order_id;";
                        runSqlQuery(sqlQuery, function (err, rows, fields) {
                            if (err) { console.log('Error ' + err); initializeMenu(); };
                            
                            console.log('The client named ' + customerName + ' has the total sum of orders = ' + rows[0].total);
                            initializeMenu();
                        });
                    }
                    else {
                        console.log('Customer with this id does not exist. Enter a valid Customer Id');
                        initializeMenu();
                    }
                });
            }
            else {
                console.log('Syntax to get client name and the total sum of all orders for this client is: 6 \'client_id\'');
                initializeMenu();
            }
            break;
        case 'exit':
            connection.end();
            process.exit();
            break;
        default:
            initializeMenu();
            break;
    }
};




//end of menu functions


//start program with menu initialization

initializeMenu();
