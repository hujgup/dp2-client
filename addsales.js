"use strict";

function getCurrentDate() {
	var date = new Date();
	date = date.toISOString().replace(/[^0-9a-zA-Z]/g,'');	// current date+time ISO 8601 
	date = date.substring(0,15) + date.substring(18,19); // remove extra characters
	return date;
}

function getDate() {
	var date = document.getElementById("datetime");
	if(document.getElementBy)
		
	//Regex for date (\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})$
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
						"dateTime": getCurrentDate()
					}
				]
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
	
	event.returnValue = false;
	return false;
}

function init()
{
	document.getElementById("addsalesform").onsubmit = insertData;
}

window.onload = init;