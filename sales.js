"use strict";

/*
 * Gets the current system date and time and returns a string in the
 * ISO8601 compressed format for insertion into database.
 */
function getCurrentDateAndTime() {
	var datetime = new Date();
	datetime = datetime.toISOString().replace(/[^0-9a-zA-Z]/g,'');	// current date+time ISO8601 compressed
	datetime = datetime.substring(0,15) + datetime.substring(18,19); // remove extra characters
	return datetime;
}

/*
 * Formats a ISO8601 compressed date/time (from database) into the format DD-MM-YY HH:MM:SS for display.
 * Used in displaySalesRecords();
 */
function formatDateAndTime(datetime)
{
	return datetime.substring(9, 11)+":"+datetime.substring(11,13)+":"+datetime.substring(13,15)
			+" "+datetime.substring(6,8)+"-"+datetime.substring(4,6)+"-"+datetime.substring(0,4);
}

/*
 * Gets the date and time entered in the text field, and returns as a string
 * converted into ISO8601 compressed for entry into database. 
 * Alternatively, if no data entered in text field, it simply calls 
 * getCurrentDateAndTime() to grab local system time.
 */
function getDateAndTime() {
	var datetime = document.getElementById("datetime").value;
	var editdatetime = document.getElementById("editdatetime").value;
	
	if(datetime == "" && editdatetime != "")
		datetime = document.getElementById("editdatetime").value;
	else if (editdatetime == "" && datetime != "")
		datetime = document.getElementById("datetime").value;
	else
		return getCurrentDateAndTime();
	
	if(datetime.match(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/g))
	{
		datetime = datetime.replace(/[^0-9]/g, '');
		datetime = datetime.substring(4,8) + datetime.substring(2, 4) + datetime.substring(0, 2) + "T" 
					+ datetime.substring(8,14) + "Z";
		return datetime;
	}
	else
	{
		alert("Date/Time does not match specified format. Please input correct format for date/time.");
	}
	
}

/*
 * Sends an XMLHttpRequest to the API containing a passed json object containing a request
 * for the API. Also takes an event to stop page refreshing being required, and a callback
 * function to trigger displaySalesRecords();
 */
function sendAPIRequest(jsonData,event,callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "../dp2-api/api/", true);	// All requests should be of type post
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4)
		{
			if(xhr.status == 200)
				console.log(JSON.parse(xhr.responseText)); // Barring error conditions, responses will be valid JSON
			else
				console.error(xhr.responseText);
			
			callback(xhr);
		}
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("request=" + encodeURIComponent(JSON.stringify(jsonData)));	// Request JSON should be set to the request key
	
	event.returnValue = false; // stops page refreshing
	document.getElementById("addsalesform").reset(); // clear input fields in add form
	document.getElementById("editsalesform").reset(); // clear input fields in edit form
	return false;
}

/*
 * Constructs the json object for inserting sales data into the database.
 * Calls sendAPIRequest() to send json object to API and database.
 */
function insertData(event) {	
	var json = {
		"authent": {
			"username": "feferi",
			"password": "0413"
		},
		
		"requests": [
			{
				"type": "add",
				"records": [
					{
						"product": Number(document.getElementById("product").value),
						"quantity": Number(document.getElementById("quantity").value),
						"dateTime": getDateAndTime()
					}
				]
			}
		]
	};
	
	// UPDATED CALL SIGNATURE (return false event value)
	return sendAPIRequest(json,event,displaySalesRecords);
}

/*
 * Constructs the json object for editing sales data in the database.
 * Calls sendAPIRequest() to send json object to API and database.
 */
function editData(event) {
	var saleid = document.getElementById("saleid").value;
	var product = document.getElementById("editproduct").value;
	var quantity = document.getElementById("editquantity").value;
	
	if(saleid && saleid.match(/\d/))
	{
		var json = {
			"authent": {
				"username": "feferi",
				"password": "0413"
			},
			
			"requests": [
				{
					"type": "edit",
					"updateTo": {
						"product": Number(product),
						"quantity": Number(quantity),
						"dateTime": getDateAndTime()
					},
					"filter": {
						"type": "column",
						"name": "id",
						"value": saleid
					}
				}
			]
		};
		
		return sendAPIRequest(json, event, displaySalesRecords);
	}
	else
	{
		alert("Please enter a numerical value for sale id");
	}
	
}

/*
 * Calculate and accurately round a value to a given precision. Returns result as a string.
 * Used in displayAmount() to correctly round the amount for given item and quantity.
 */
function toFixed(value, precision)
{
	var power = Math.pow(10, precision || 0);
	return String((Math.round(value * power) / power).toFixed(precision));
}

/*
 * Calculates the amount for a sale given the value of an item, and quantity ordered.
 * Returns the result as a string in a currency format with $ sign and ,'s inserted.
 * Used in displaySalesRecords().
 */
function displayAmount(value, quantity)
{
	var result = 0;
	result = toFixed((value * quantity)/100, 2);
	result = result.replace(/(?!^)(?=(?:\d{3})+(?:\.|$))/gm, ',');
	return "$" + result;
}

/*
 * Displays the sales records in a predefined html table by inserting data
 * into the existing elements of the table. Checks for new entres into table
 * by doing a retrieve request to populate table, and also compares existing data
 * in table against latest retrieve.
 */
function displaySalesRecords() {
	
	var table = document.getElementById("table");
	
	var json = {
		"authent": {
			"username": "feferi",
			"password": "0413"
		},
		
		"requests": [
			{
				"type": "retrieve"
			}
		]
	};
	
	
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "../dp2-api/api/", true);	// All requests should be of type post
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				console.log(JSON.parse(xhr.responseText)); // Barring error conditions, responses will be valid JSON
				var data = JSON.parse(xhr.responseText); 
				
				// Check for new entries
				if(table.rows.length-1 < data[0].length)
				{
					var i;
					for (i=table.rows.length-1; i < data[0].length; i++)
					{
						var row 		= table.insertRow(i+1);
						
						var id 			= row.insertCell(0);
						var product 	= row.insertCell(1);
						var name 		= row.insertCell(2);
						var quantity 	= row.insertCell(3);
						var amount 		= row.insertCell(4);
						var dateTime 	= row.insertCell(5);
						
						id.innerHTML 		= data[0][i].id;
						product.innerHTML 	= data[0][i].product;
						name.innerHTML 		= data[0][i].name;
						quantity.innerHTML 	= data[0][i].quantity;
						amount.innerHTML 	= displayAmount(data[0][i].value, data[0][i].quantity);
						dateTime.innerHTML 	= formatDateAndTime(data[0][i].dateTime);
					}
				}
				
				// Check against existing entries to update
				for(i=1; i < table.rows.length; i++)
				{
					if(table.rows[i].cells[0].innerHTML != data[0][i-1].id)
						table.rows[i].cells[0].innerHTML = data[0][i-1].id;
					
					if(table.rows[i].cells[1].innerHTML != data[0][i-1].product)
						table.rows[i].cells[1].innerHTML = data[0][i-1].product;
					
					if(table.rows[i].cells[2].innerHTML != data[0][i-1].name)
						table.rows[i].cells[2].innerHTML = data[0][i-1].name;
					
					if(table.rows[i].cells[3].innerHTML != data[0][i-1].quantity)
						table.rows[i].cells[3].innerHTML = data[0][i-1].quantity;
					
					if(table.rows[i].cells[4].innerHTML != displayAmount(data[0][i-1].value, data[0][i-1].quantity))
						table.rows[i].cells[4].innerHTML = displayAmount(data[0][i-1].value, data[0][i-1].quantity);
					
					if(table.rows[i].cells[5].innerHTML != formatDateAndTime(data[0][i-1].dateTime))
						table.rows[i].cells[5].innerHTML = formatDateAndTime(data[0][i-1].dateTime);
					
					
				}
					
			} else {
				console.error(xhr.responseText);
			}
		}
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("request=" + encodeURIComponent(JSON.stringify(json)));
}

/*
 * Called when the page/window is loaded.
 * Responsible for handling form submit functions and initial display of sales tables.
 */
function init()
{
	//if(validateInput())
		document.getElementById("addsalesform").onsubmit = insertData;
		document.getElementById("editsalesform").onsubmit = editData;
		displaySalesRecords();
}

window.onload = init;