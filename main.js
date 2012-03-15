/*James E. McPherson III
 * Visual Frameworks
 * Project 2
 * 1203
 * 03/07/2012
 */

// Wait until the DOM is ready.
window.addEventListener("DOMContentLoaded", function() {
	
	//getElementById function
	function $(x){
		var theElement = document.getElementById(x);
		return theElement;
	};
	
	//Create select field element and populate with options.
	function makeDropDown() {
		var 	formTag = document.getElementsByTagName("form"), //formTag is an array of all the form tags.
				selectLi = $("select"),
				//Create <select></select> element
				makeSelect = document.createElement("select");
				makeSelect.setAttribute("id", "position");
		//Loop through and populate option elements		
		for(var i=0, j=positions.length; i<j; i++){
			var makeOption = document.createElement("option");
			var optText = positions[i];
			makeOption.setAttribute("value", optText);
			makeOption.innerHTML = optText;
			makeSelect.appendChild(makeOption);
		}
		selectLi.appendChild(makeSelect);
	};
	
	//Find value of selected radio button.
	function getCheckboxValue(){
		if($('starter').checked) {
			starterValue = $("starter").value;
		}else {
			starterValue = "No";
		}
	}
	//Toggle ON/OFF used for displaying data
	function toggleControls(n){
		switch(n){
			case"on":
				$('addPlayerForm').style.display = "none";
				$('clear').style.display = "inline";
				$('display').style.display = "none";
				$('addNew').style.display = "inline";
				break;
			case "off":
				$('addPlayerForm').style.display = "block";
				$('clear').style.display = "inline";
				$('display').style.display = "inline";
				$('addNew').style.display = "none";
				$('players').style.display = "none";
				break;
			default:
				return false;
		}
	}
	// Create StoreData Function
	function storeData(){
		//Create Random Key
		var 	id									= Math.floor(Math.random()*1000001);
		getCheckboxValue();
		// gather up all our form field values and store in an object.
		// Object properties contain array with the form label and input value.
		var item = {};
				item.position				= ["Position:", $('position').value];
				item.pname				= ["Player Name:", $('pname').value];
				item.bye						= ["Bye Week:", $('byeweek').value];
				item.starter				= ["Starter:", starterValue];
				item.skill						= ["Skill Level:", $('skill').value];
				item.notes					= ["Notes:", $('notes').value];
		//Save Data into Local Storage: Use Stringify to convert our object to a string.
		localStorage.setItem(id, JSON.stringify(item));
		alert("Player Saved!");
	};
	 // function to get data from form Values & display in div
	function getData() {
		toggleControls("on");
		if(localStorage.length === 0) {
			alert("There are no players stored!")
		}
		//Create Div/ul/li tags to display data
		var makeDiv = document.createElement('div');
		makeDiv.setAttribute("id", "players");
		document.body.appendChild(makeDiv);
		var makeList = document.createElement('ul');
		makeDiv.appendChild(makeList);
		$('players').style.display = "block";
		for(var i=0, j=localStorage.length; i<j; i++) {
			var makeLi = document.createElement('li');
			var linksLi = document.createElement('li');
			makeList.appendChild(makeLi);
			var key = localStorage.key(i);
			var value = localStorage.getItem(key);
			var obj = JSON.parse(value);
			var makeSubList = document.createElement('ul');
			makeLi.appendChild(makeSubList);
			for(var n in obj) {
				var makeSubLi = document.createElement('li');
				makeSubList.appendChild(makeSubLi);
				var optSubText = obj[n][0] +" "+ obj[n][1];
				makeSubLi.innerHTML = optSubText;
				makeSubList.appendChild(linksLi);
			}
			makeItemLinks(localStorage.key(i), linksLi); // Create Edit and Delete Buttons for each item in localStorage
		}
	};
	
	// Make Item Links
	function makeItemLinks(key, linksLi) {
	//add edit Link
		var editLink = document.createElement("a");
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Player";
		editLink.addEventListener("click", editPlayer);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		//add a line Break
		var breakTag = document.createElement("br");
		linksLi.appendChild(breakTag);
		
		//Create delete variable
		var deleteLink = document.createElement("a");
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Player";
		//deleteLink.addEventListener("click", deletePlayer);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}
	
	function editPlayer() {
		// Get Data from localStorage
		var value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//show the form
		toggleControls("off");
		
		//populate form fields with current localStorage vlaues.
		$("position").value = item.position[1];
		$("pname").value = item.pname[1];
		$("byeweek").value = item.bye[1];
		if(item.starter[1] == "Yes"){
			$("starter").setAttribute("checked", "checked");
		}
		$("skill").value = item.skill[1];
		$("notes").value = item.notes[1];
		
		//Remove the initial listener from the input 'save contact' button.
		save.removeEventListener("click", storeData);
		//change Submit Button Value to Edit Player
		$('submit').value = "Edit Player";
		var editSubmit = $('submit');
		// save the key value established in this function as a property of the editSubmit event
		//so we can use tht value when we save the data we edit.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	}
	
	function validate(e) {
		//Define the elements we want to check
		var getPosition = $("position");
		var getPname = $("pname");
		
		//Reset Error messages
		errorMessage.innerHTML = "";
		
		//Get Error Messages
		var messageArray = [];
		//position validation
		if(getPosition.value === "--Select Position--"	) {
			var positionError = "Please Select A Position";
			getPosition.style.border = "1px solid red";
			messageArray.push(positionError);
		}
		//Check Player Name Validation
		if(getPname.value === "" ) {
			var pNameError = "Please Enter a Player Name";
			getPname.style.border= "1px solid red";
			getPname.push(pNameError);
		}
		//If errors are present, display to user
		if(messageArray.length >= 1) {
			for(var i=0, j=messageArray.length; i < j; i++){
				var txt = document.createElement("li");
				txt.innerHTML = messageArray[i];
				$("errors").appendChild(txt);
			};
		}
		e.preventDefault();
		return false;
	}
	
	//function to clear data from localStorage
	function clearLocal() {
		if(localStorage.length === 0) {
			alert("There is no data to clear.");
		}else{
			localStorage.clear();
			alert("All Players have been deleted!");
			window.location.reload();
			return false;
		}
	}
	
	//variable defaults
	var 	positions = ["--Select Position--", "QB", "RB", "WR", "TE", "K", "DEF"],
			starterValue = "No",
			errorMessage = $("errors");
	makeDropDown();
	
	
	//Set Link & submit Click Events
	var displayLink = $('display');
	displayLink.addEventListener("click", getData);
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocal);
	var save = $("submit");
	save.addEventListener("click", validate);
});
