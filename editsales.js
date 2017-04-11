"use strict";

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
}

/*function checkForInput() {
	
	var salesid = document.getElementById("salesid").value;
	var product = document.getElementById("product").value;
	var quantity = document.getElementById("quantity").value;
	var date = document.getElementById("datetime").value;
	
	var result = true;
	var errMsg="";
	
	if(!saleid.match(/\d/))
	{
		errMsg += "Please enter a numerical value for the sale id.";
		result = false;
	}
	
	if(product && !product.match(/\d/))
	{
		errMsg += "Please enter a numerical value for the product id.";
		result = false;
	}
	
	if(quantity && !quantity.match(/\d/))
	{
		errMsg += "Please enter a numerical value for the quantity.\n"
		result = false;
	}
	
	if(date && !date.match(/\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}/))
	{
		errMsg += "Date/Time does not match format DD-MM-YYYY HH:MM:SS\n"
		result = false;
	}
		
	if(!result)
		alert(errMsg);
	
	return result;
	
}*/

function insertData(event) {
	
	var saleid = document.getElementById("saleid").value;
	var product = document.getElementById("product").value;
	var quantity = document.getElementById("quantity").value;
	var datetime = document.getElementById("datetime").value;
	
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
						"product": Number(document.getElementById("product").value),
						"quantity": Number(document.getElementById("quantity").value),
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
		
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "../dp2-api/api/", true);	// All requests should be of type post
		xhr.onreadystatechange = function() {
			if(xhr.readyState == 4) {
				if(xhr.status == 200) {
					console.log(JSON.parse(xhr.responseText)); // Barring error conditions, responses will be valid JSON
				} else {
					console.error(xhr.responseText);
				}
			}
		};
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send("request=" + encodeURIComponent(JSON.stringify(json)));	// Request JSON should be set to the request key
	}
	else
	{
		alert("Please enter a numerical value for sale id");
	}
	event.returnValue = false;
	return false;
	
}

function init()
{
	//if(validateInput())
		document.getElementById("editsalesform").onsubmit = insertData;
}

window.onload = init;