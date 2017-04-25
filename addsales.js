"use strict";

function getCurrentDateAndTime() {
	var datetime = new Date();
	datetime = datetime.toISOString().replace(/[^0-9a-zA-Z]/g,'');	// current date+time ISO 8601 
	datetime = datetime.substring(0,15) + datetime.substring(18,19); // remove extra characters
	return datetime;
}

function getDateAndTime() {
	var datetime = document.getElementById("datetime").value;
	
	if(datetime != "")	
	{
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
	else
		return getCurrentDateAndTime();
}

function sendAPIRequest(jsonData,event,callback)
{
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "../dp2-api/api/", true);	// All requests should be of type post
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4) {
			if(xhr.status == 200) {
				console.log(JSON.parse(xhr.responseText)); // Barring error conditions, responses will be valid JSON
			} else {
				console.error(xhr.responseText);
			}
			callback(xhr);
		}
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("request=" + encodeURIComponent(JSON.stringify(jsonData)));	// Request JSON should be set to the request key
	
	event.returnValue = false;
	return false;
}

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
	
	// UPDATED CALL SIGNATURE
	return sendAPIRequest(json,event,displaySalesRecords);
}

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
		
		sendAPIRequest(json);
		displaySalesRecords();
	}
	else
	{
		alert("Please enter a numerical value for sale id");
	}
	
}

function displaySalesRecords() {
	
	var table = document.getElementById("table");
	
	//Get filter values
	//var product = document.getElementById("product").value;
	//var quantity = document.getElementById("quantity").value;
	//var datefrom = document.getElementById("datefrom").value;
	//var dateto = document.getElementById("dateto").value;
	//var records = document.getElementById("records").value;
	
	
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
						var value 		= row.insertCell(4);
						var dateTime 	= row.insertCell(5);
						
						id.innerHTML 		= data[0][i].id;
						product.innerHTML 	= data[0][i].product;
						name.innerHTML 		= data[0][i].name;
						quantity.innerHTML 	= data[0][i].quantity;
						value.innerHTML 	= data[0][i].value;
						dateTime.innerHTML 	= data[0][i].dateTime;
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
					
					if(table.rows[i].cells[4].innerHTML != data[0][i-1].value)
						table.rows[i].cells[4].innerHTML = data[0][i-1].value;
					
					if(table.rows[i].cells[5].innerHTML != data[0][i-1].dateTime)
						table.rows[i].cells[5].innerHTML = data[0][i-1].dateTime;
					
					
				}
					
			} else {
				console.error(xhr.responseText);
			}
		}
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("request=" + encodeURIComponent(JSON.stringify(json)));
}

function init()
{
	//if(validateInput())
		document.getElementById("addsalesform").onsubmit = insertData;
		document.getElementById("editsalesform").onsubmit = editData;
		displaySalesRecords();
}

window.onload = init;