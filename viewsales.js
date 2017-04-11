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
				
				for (i=0; i < data[0].length; i++)
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
			} else {
				console.error(xhr.responseText);
			}
		}
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send("request=" + encodeURIComponent(JSON.stringify(json)));
}

window.onload = displaySalesRecords;