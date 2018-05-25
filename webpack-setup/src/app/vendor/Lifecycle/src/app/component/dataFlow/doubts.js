* Will component recieve filtered state or actual this.state
* How will state change will be converted to corresponsing HTML operations
https://facebook.github.io/react/docs/reconciliation.html

Example

Array

Initial State = {
	list : [1,2,3,4]
}

Case 1 : [1,2,3,4,5] ==> Insert node
Case 2 : [1,2,3,5] ==> Change text
Case 3 : [1,2,3] ==> Delete Node

Object

Initial State = {
	job : {
		name : "Oracle"
		title : "Title",
		description : "Some Text"
	}
}

Case 1 : {
		name : "Oracle"
		title : "Title",
		description : "Some Text",
		status : "saved"
	} ==> Insert node
Case 2 : {
		name : "Oracle"
		title : "Title",
		description : "Change Text"
	} ==> Change text
Case 3 : {
		name : "Oracle"
		title : "Title"		
	} ==> Delete Node


* VDOM gives as a way to define view as a function of state
* But certain state of our pages are governed by plugins which update dom by directly manipulating it.
	For example
	* Suggestor changing value of input field
	* In such cases we 
		* Only need to update state on form submit
		* No need of view render


