"use strict";

function insertData()
{
	
	var date = new Date()
	
	var json = {
		"authent": {
			"username": sessionStorage.username,
			"password": sessionStorage.passwd
		},
		
		"requests": [
			{
				"type": "add",
				"records": [
					{
						"product": document.getElementById("product");,
						"quantity": document.getElementById("quantity");
						"dateTime": date.toISOString().replace(/[^0-9a-zA-Z]/g,'');	// current date+time ISO 8601 
					}
				]
			}
		]
	};
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "/../../dp2-api/api_add_request.php", true);	// All requests should be of type post
	xhr.onreadystatechange = function() {
		if(xhr.readyState == 4 && this.status == 200) {
			console.log(JSON.parse(xhr.responseText)); // Barring error conditions, responses will be valid JSON
		}
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("request=" + encodeURIComponent(JSON.stringify(json)));	// Request JSON should be set to the request key
}