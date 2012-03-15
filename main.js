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
	function storeData(key){
		//If there is no key, this is a new item and we need to generate a new key
		if(!key){ 
		//Create Random Key
		var 	id									= Math.floor(Math.random()*1000001);
		} else {
			//else, set the id to the existing key we're editing so that it will save over the data.
			//The key is the same key that's been passed along from the editSubmit event handler
			//to the validate function, and then passed here, into the storeData function.
			id = key;
		}
		getCheckboxValue();
		// gather up all our form field values and store in an object.
		// Object properties contain array with the form label and input value.
		var item = {};
				item.position				= ["Position:", $('position').value];
				item.pname				= ["Player Name:", $('pname').value];
				item.team					= ["Team Name:", $('team').value];
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
		$('players').style.display = "display";
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
			makeItemLinks(localStorage.key(i), linksLi); //Create our edit and delete buttons/links for each item in localStorage.
		}
	}
	
	// Create the edit/delete links for each stored item when displayed.
	function makeItemLinks(key, linksLi) {
		//edit Item Link
		var editLink = document.createElement('a');
		editLink.href = "#";
		editLink.key = key;
		var editText = "Edit Player";
		editLink.addEventListener("click", editItem);
		editLink.innerHTML = editText;
		linksLi.appendChild(editLink);
		
		//add line break
		var breakTag = document.createElement('br');
		linksLi.appendChild(breakTag);
		
		//Delete Item Link
		var deleteLink = document.createElement('a');
		deleteLink.href = "#";
		deleteLink.key = key;
		var deleteText = "Delete Player";
		deleteLink.addEventListener("click", deleteItem);
		deleteLink.innerHTML = deleteText;
		linksLi.appendChild(deleteLink);
	}
	
	//Edit Item Function
	function editItem() {
		//Get data from our item in local storage
		var  value = localStorage.getItem(this.key);
		var item = JSON.parse(value);
		
		//show the form
		toggleControls("off");
		
		//populate form fields with current localStorage values
		$('position').value = item.position[1];
		$('pname').value = item.pname[1];
		$('team').value = item.team[1];
		$('byeweek').value = item.bye[1];
		if(item.starter[1] == "Yes") {
			$('starter').setAttribute("checked", "checked");
		}
		$('skill').value = item.skill[1];
		$('notes').value = item.notes[1];
		
		//Remove the initial listener from the input 'save contact' button.
		saveLink.removeEventListener("click", storeData);
		//Change submit button value to "Edit Player"
		$('submit').value = "Edit Player";
		var editSubmit = $('submit');
		//Save the key value established in this function as a property of the editSubmit event
		//So we can use that value when we save the data we edited.
		editSubmit.addEventListener("click", validate);
		editSubmit.key = this.key;
	}
	
	function deleteItem () {
		var ask = confirm("Are you sure you want to release this player?");
		if(ask){
			localStorage.removeItem(this.key);
			alert("Player was released!");
			window.location.reload();
		}else {
			alert("Player was NOT released");
		}
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
	
	function validate (e) {
		//Define the elements we want to check
		var getPosition = $('position');
		var getPname = $('pname');
		var getTeam = $('team');
		
		//Reset Error Mesages
		errMsg.innerHTML = "";
		getPosition.style.border = "1px solid black";
		getPname.style.border = "1px solid black";
		
		//Get error messages
		var messageAry = [ ];
		//Position Validation
		if(getPosition.value === "--Select Position--") {
			var positionError = "* Please Choose A Position";
			getPosition.style.border = "3px solid #a31d1d";
			messageAry.push(positionError);
		}
		
		//Check for Player Name Validation
		if(getPname.value === "") {
			var pNameError = "* Please Enter A Player Name";
			getPname.style.border = "3px solid #a31d1d";
			messageAry.push(pNameError);
		}
		
		//Team Validation
		if(getTeam.value === "") {
			var teamError = "* Please Enter A Team Name";
			getTeam.style.border = "3px solid #a31d1d";
			messageAry.push(teamError);
		}
		//If there were errors, display them on the screen
		if(messageAry.length >= 1) {
			for(var i=0, j=messageAry.length; i < j; i++) {
				var txt = document.createElement('li');
				txt.innerHTML = messageAry[i];
				errMsg.appendChild(txt);
			}
			e.preventDefault();
			return false;
		}else{
			//If all is OK, save our data
			storeData(this.key);
		}	
	}
	
	//variable defaults
	var 	positions = ["--Select Position--", "QB", "RB", "WR", "TE", "K", "DEF"],
			starterValue = "No",
			errMsg = $('errors');
;
	makeDropDown();
	
	//Set Link & submit Click Events
	var displayLink = $('display');
	displayLink.addEventListener("click", getData);
	var clearLink = $('clear');
	clearLink.addEventListener("click", clearLocal);
	var saveLink = $("submit");
	saveLink.addEventListener("click", validate);
});
