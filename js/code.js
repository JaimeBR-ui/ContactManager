var urlBase = 'https://COP4331.xyz/LAMPAPI';
var extension = 'php';

var userID = 0;
var firstName = "";
var lastName = "";
var error = "";

// Mode variables
var darkModeToggle = false;
var darkMode = '/css/darkMode.css';
var lightMode = '/css/lightMode.css';

// Editing / Deletion variables
var idToEdit = "";
var idToDelete = "";

function doLogin()
{
	// Reset variables to clear past login attempts
	userID = 0;
	firstName = "";
	lastName = "";
	error = "";

	// Grab the data we need from the HTML fields
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	//Build our json payload
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';

	//used for plaintext password
	//var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';


	var url = urlBase + '/Login.' + extension;
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

        userID = jsonObject.userID;
		error = jsonObject.error;

        // If error is not empty
		if( error !== "" )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

        window.location.href = "contacts.html";

	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

	document.getElementById('userName').innerHTML = "Welcome, " + firstName + " " + lastName + "!";
}

// will add new user to the database and sign them into their new account (so that they don't login after signing up)
function doSignup()
{
	userID = 0;
	firstName = "";
	lastName = "";
	error = "";

	firstName = document.getElementById("signupFirstName").value;
	lastName = document.getElementById("signupLastName").value;

	var login = document.getElementById("signupUserName").value;
	var password = document.getElementById("signupPassword").value;
	var confirmPassword = document.getElementById("signupPasswordConfirm").value;
	var hash = md5( password );

	document.getElementById("signupResult").innerHTML = ""; // DEBUG

	// check if confirmPassword matches password
	if (password !== confirmPassword)
		{
			document.getElementById("signupResult").innerHTML = "Passwords do not match";
			return;
		}

	// check for invalid password
	if (password === "" || password === null)
		{
			document.getElementById("signupResult").innerHTML = "Invalid password";
			return;
		}

	// check for invalid username
	if (login === "" || login === null)
		{
			document.getElementById("signupResult").innerHTML = "Invalid username";
			return;
		}

	var jsonPayload = '{ "firstName" : "' + firstName
					+ '", "lastName" : "' + lastName
					+ '", "login" : "'    + login
					+ '", "password" : "' + hash + '" }';

	var url = urlBase + '/Signup.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userID = jsonObject.userID;
		error = jsonObject.error;

		// If error is not empty
		if( error !== "" )
		{
			document.getElementById("signupResult").innerHTML = "Sign Up Failed";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

		window.location.href = "contacts.html";
	}
	catch(err)
	{
		document.getElementById("signupResult").innerHTML = err.message;
	}

	document.getElementById('userName').innerHTML = "Welcome, " + firstName + " " + lastName + "!";
}

function changeStyle(number)
{
	var pathDepth;
	// This is the depth the file is in relation to the root.
	// Example:
	// root
	// |->index.html
	// |->html |
	//         |->about.html
	// this file is one layer deep in the root
	if (number == 0)
		pathDepth = ".";
	else if (number == 1)
		pathDepth = "..";
	else if (number == 2)
		pathDepth = "../..";
	// TODO: remember mode state when moving pages
	console.log('Press recorded!');
	var mode;
	var path;

	if (darkModeToggle)
	{
		mode = 'Dark Mode';
		path = lightMode;
	}
	else
	{
		mode = 'Light Mode';
		path = darkMode;
	}
	document.getElementById('mode').setAttribute('href', pathDepth + path);
	document.getElementById('modeDisplay').innerHTML = mode;

	darkModeToggle = !darkModeToggle;
}

function goToAddContacts()
{
	replace('logoutButton', 'cancelAddContactButton');
	replace('goToAddContactsButton', 'addContactsButton');
	replace('searchContactsDiv', 'addContactsDiv');

	document.getElementById('userName').innerHTML = "Please add your contact's information below";

	// clear out form
	document.getElementById("ContactsFirstNameText").value = "";
	document.getElementById("ContactsLastNameText").value = "";
	document.getElementById("ContactsEmailText").value = "";
	document.getElementById("ContactsPhoneText").value = "";
	document.getElementById("ContactsAddressText").value = "";
	document.getElementById("ContactsCityText").value = "";
	document.getElementById("ContactsStateText").value = "";
	document.getElementById("ContactsZIPCodeText").value = "";
	document.getElementById("ContactsPronounsText").value = "";
}

function goToSearchContacts()
{
	replace('cancelAddContactButton', 'logoutButton');
	replace('addContactsButton', 'goToAddContactsButton');
	replace('confirmEditButton', 'goToAddContactsButton');
	replace('addContactsDiv', 'searchContactsDiv');

	// if edit was cancelled
	idToEdit = "";

	// TODO - might add back in later
	//document.getElementById('userName').innerHTML = "Welcome, " + firstName + " " + lastName + "!";
}


function replace(hide, show)
{
	// hides / shows a set of divs
	document.getElementById(hide).style.display="none";
	document.getElementById(show).style.display="block";
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userID = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userID" )
		{
			userID = parseInt( tokens[1].trim() );
		}
	}

	if( userID < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
	}
}

function doLogout()
{
	userID = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContacts()
{
    // Grab values from HTML
	var newContactsFirstName = document.getElementById("ContactsFirstNameText").value;
	var newContactsLastName = document.getElementById("ContactsLastNameText").value;
	var newContactsEmail = document.getElementById("ContactsEmailText").value;
	var newContactsPhone = document.getElementById("ContactsPhoneText").value;
	var newContactsAddress = document.getElementById("ContactsAddressText").value;
	var newContactsCity = document.getElementById("ContactsCityText").value;
	var newContactsState = document.getElementById("ContactsStateText").value;
	var newContactsZIPCode = document.getElementById("ContactsZIPCodeText").value;
	var newContactsPronouns = document.getElementById("ContactsPronounsText").value;

	document.getElementById("ContactsAddResult").innerHTML = "";

    // Create payload to send to server
	var jsonPayload = '{"firstName" : "' + newContactsFirstName +
						'", "lastName" : "' + newContactsLastName +
						'", "email" : "' + newContactsEmail +
						'", "phone" : "' + newContactsPhone +
						'", "address" : "' + newContactsAddress +
						'", "city" : "' + newContactsCity +
						'", "state" : "' + newContactsState +
						'", "zip code" : "' + newContactsZIPCode +
						'", "pronouns" : "' + newContactsPronouns +
						'", "userID" : "' + userID +'"}';


    // Where we are sending payload
	var url = urlBase + '/AddContacts.' + extension;

    // Create and send a XMLHttpRequest
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.send(jsonPayload);

		document.getElementById("userName").innerHTML = "Contact has been added";

		// go back to search after successfully adding
		goToSearchContacts();
	}
	catch(err)
	{
		document.getElementById("userName").innerHTML = err.message;
	}

	// do search contacts again so that the new contact appears if it should be in the search
	searchContacts();
}

function searchContacts()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("ContactsSearchResult").innerHTML = "";

	// Remove the old contact elements before the new ones are added
	while (document.getElementById("ContactsList").hasChildNodes())
	{
    	document.getElementById("ContactsList").removeChild(document.getElementById("ContactsList").lastChild);
	}

    // Create payload to send to server
	var jsonPayload = '{"search" : "' + srch + '", "userID" : "' + userID + '"}';

	// Where we are sending payload
	var url = urlBase + '/SearchContacts.' + extension;

    // Create and send a XMLHttpRequest
	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// Attempt to send and process the response
	try
	{
        // Send the Payload
        xhr.send(jsonPayload);

    	var jsonObject = JSON.parse( xhr.responseText );

    	// go through array of contacts
    	for( var i=0; i<jsonObject.results.length; i++ )
    	{
    	    // contact vars
    	    var ID = jsonObject.results[i].ID;
			var firstName = jsonObject.results[i].firstName;
			var lastName = jsonObject.results[i].lastName;
			var pronouns = jsonObject.results[i].pronouns;
			var email = jsonObject.results[i].email;
			var phone = jsonObject.results[i].phone;
			var address = jsonObject.results[i].address;
			var city = jsonObject.results[i].city;
			var state = jsonObject.results[i].state;
			var zipCode = jsonObject.results[i]["zip code"];

    		// make new button for the collapsable component, and give it an ID that corresponds to the ID # of the contact in the database ("#-coll")
    		var collButton = document.createElement("button");
    		collButton.innerHTML = firstName + " " + lastName;
    		collButton.id = ID + "-coll";
            collButton.className = "collapsible";

    		// make new div for the content, and give it an ID the corresponds to the contact's ID in the database ("#")
    		var contentDiv = document.createElement("div");
    		contentDiv.id = "" + ID;
    		contentDiv.className = "content";

    		// create the <p> for the content div
    		var pronounP = document.createElement("p");
    		var emailPhoneP = document.createElement("p");
    		var addressP = document.createElement("p");
    		var cityStateZipP = document.createElement("p");

    		// fill <p>s with content from json
    		pronounP.innerHTML = "Pronouns: " + pronouns;
    		emailPhoneP.innerHTML = "Email: " + email + "   Phone: " + phone;
    		addressP.innerHTML = "Address: " + address;
    		cityStateZipP.innerHTML = city + ", " + state + " " + zipCode;

    		// add the <p>s to the content div
    		contentDiv.appendChild(pronounP);
    		contentDiv.appendChild(emailPhoneP);
    		contentDiv.appendChild(addressP);
    		contentDiv.appendChild(cityStateZipP);

    		// create edit and delete buttons
    		var editButton = document.createElement("button");
    		editButton.type = "button";
    		editButton.className = "gotoEditButton";
    		editButton.addEventListener("click", function() { gotoEditContact(this); });
    		editButton.innerHTML = "Edit";
    		var deleteButton = document.createElement("button");
    		deleteButton.type = "button";
    		deleteButton.className = "gotoDeleteButton";
    		deleteButton.addEventListener("click", function() { gotoDeleteContact(this); });
    		deleteButton.innerHTML = "Delete";

    		// add buttons to the content div
    		contentDiv.appendChild(editButton);
    		contentDiv.appendChild(deleteButton);

    		// add collbutton and contentDiv to the contactsList
    		document.getElementById("ContactsList").appendChild(collButton);
    		document.getElementById("ContactsList").appendChild(contentDiv);

    		collButton.addEventListener("click", function() {
    						this.classList.toggle("active");
    						var content = this.nextElementSibling;
    						if (content.style.maxHeight){
      							content.style.maxHeight = null;
    						}
							else {
      							content.style.maxHeight = content.scrollHeight + "px";
    						}
  						});
    	}

    	document.getElementById("userName").innerHTML = "Contact(s) has been retrieved";
	}
	catch(err)
	{
		document.getElementById("userName").innerHTML = err.message;
	}
}

// Will bring up the screen so that the contact can be edited, contact is a reference to the specific edit button that was clicked
function gotoEditContact(contact)
{
	// switch view
	replace('logoutButton', 'cancelAddContactButton');
	replace('goToAddContactsButton', 'confirmEditButton');
	replace('searchContactsDiv', 'addContactsDiv');
	document.getElementById('userName').innerHTML = "Please edit your contact's information below";

	// get id so that this specific contact can be accessed later
	idToEdit = contact.parentNode.id;

	// search by id
	var jsonPayload = '{"ID" : "' + idToEdit + '"}';
	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
	    // Send the Payload
        xhr.send(jsonPayload);

    	var jsonObject = JSON.parse( xhr.responseText );

		var jsonObject = JSON.parse( xhr.responseText );

		// contact vars
		var firstName = jsonObject.results[0].firstName;
		var lastName = jsonObject.results[0].lastName;
		var pronouns = jsonObject.results[0].pronouns;
		var email = jsonObject.results[0].email;
		var phone = jsonObject.results[0].phone;
		var address = jsonObject.results[0].address;
		var city = jsonObject.results[0].city;
		var state = jsonObject.results[0].state;
		var zipCode = jsonObject.results[0]["zip code"];


	    // put current contact info into the form for ease of access
		document.getElementById("ContactsFirstNameText").value = firstName;
		document.getElementById("ContactsLastNameText").value = lastName;
		document.getElementById("ContactsEmailText").value = email;
		document.getElementById("ContactsPhoneText").value = phone;
		document.getElementById("ContactsAddressText").value = address;
		document.getElementById("ContactsCityText").value = city;
		document.getElementById("ContactsStateText").value = state;
		document.getElementById("ContactsZIPCodeText").value = zipCode;
		document.getElementById("ContactsPronounsText").value = pronouns;
	}
	catch(err)
	{
		document.getElementById("userName").innerHTML = err.message;
	}
	// this method is done, now we just wait for user click of the confirmEditButton then we run commitEditContact()
}

// will actually commit the edit
function commitEditContact()
{
	// commit the changes to the contact referenced by idToEdit
	var newContactsFirstName = document.getElementById("ContactsFirstNameText").value;
	var newContactsLastName = document.getElementById("ContactsLastNameText").value;
	var newContactsEmail = document.getElementById("ContactsEmailText").value;
	var newContactsPhone = document.getElementById("ContactsPhoneText").value;
	var newContactsAddress = document.getElementById("ContactsAddressText").value;
	var newContactsCity = document.getElementById("ContactsCityText").value;
	var newContactsState = document.getElementById("ContactsStateText").value;
	var newContactsZIPCode = document.getElementById("ContactsZIPCodeText").value;
	var newContactsPronouns = document.getElementById("ContactsPronounsText").value;

	document.getElementById("ContactsAddResult").innerHTML = "";

    // Create payload to send to server
	var jsonPayload = '{"firstName" : "' + newContactsFirstName +
						'", "lastName" : "' + newContactsLastName +
						'", "email" : "' + newContactsEmail +
						'", "phone" : "' + newContactsPhone +
						'", "address" : "' + newContactsAddress +
						'", "city" : "' + newContactsCity +
						'", "state" : "' + newContactsState +
						'", "zip code" : "' + newContactsZIPCode +
						'", "pronouns" : "' + newContactsPronouns +
						'", "ID" : "' + idToEdit +'"}';

	var url = urlBase + '/updateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
	    xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userName").innerHTML = err.message;
	}

	// redo search but, now that the selected element is edited
	searchContacts();

	// go back to search contacts
	goToSearchContacts();

	document.getElementById("userName").innerHTML = "Contact has been updated";
}


// will bring up pop-up to confirm deletion
function gotoDeleteContact(contact)
{
	// get id of object to potentially delete
	idToDelete = contact.parentNode.id;

	// get popup div and enable it
	var popup = document.getElementById("popupConfirmDeleteDiv");
	popup.style.display = "block";
}

// will actually commit the delete
function commitDeleteContact()
{
	// use idToDelete
	var jsonPayload = '{"ID" : "' + idToDelete + '"}';



	var url = urlBase + '/Delete.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
	    xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("userName").innerHTML = err.message;
	}

	// close popup
	var popup = document.getElementById("popupConfirmDeleteDiv");
	popup.style.display = "none";

	// get rid of idToDelete
	idToDelete = "";

	// redo search but, now that the selected element is deleted
	searchContacts();

	document.getElementById("userName").innerHTML = "Contact has been deleted";
}

// close popup without deleting
function cancelDeleteContact()
{
	// close popup on click of cancel button
	var popup = document.getElementById("popupConfirmDeleteDiv");
  	popup.style.display = "none";

	// get rid of idToDelete
	idToDelete = "";
}
