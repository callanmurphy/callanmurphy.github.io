/* 
 * This code is provided solely for the personal and private use of students 
 * taking the CSC309H course at the University of Toronto. Copying for purposes 
 * other than this use is expressly prohibited. All forms of distribution of 
 * this code, including but not limited to public repositories on GitHub, 
 * GitLab, Bitbucket, or any other online platform, whether as given or with 
 * any changes, are expressly prohibited. 
*/ 

/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array

	var title = document.getElementById('newBookName').value;
	var author = document.getElementById('newBookAuthor').value;
	var genre = document.getElementById('newBookGenre').value;
	var book = new Book(title, author, genre)
	libraryBooks.push(book);


	// Call addBookToLibraryTable properly to add book to the DOM

	addBookToLibraryTable(book);
	
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron

	var id = document.getElementById('loanBookId').value;
	var card = document.getElementById('loanCardNum').value;
	var book = libraryBooks[id];
	var patron = patrons[card];


	// Add patron to the book's patron property

	book.patron = patron;
	

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	
    addBookToPatronLoans(book);
	

	// Start the book loan timer.

	book.setLoanTime();
	

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	// referenced https://stackoverflow.com/questions/15340840/get-all-elements-with-the-same-class
    // referenced https://stackoverflow.com/questions/50522916/javascript-on-click-event-for-multiple-buttons-with-same-class

	var allButtons = document.getElementsByClassName("return");
	var card = 0;
	var clicked = false;

	if(e.target.className == "return"){
		for(var i = 0; i < allButtons.length; i++){
			if(e.target == allButtons[i]){
				clicked = true;
				card = i;
			}
		}
	}

    loans = []

	for(var i = 0; i < numberOfBooks; i++){
        if(libraryBooks[i].patron !== null){
        	loans.push(libraryBooks[i]);
        }
	}


    if(clicked == true){

    	var book = loans[card];

	// Call removeBookFromPatronTable()
    
        removeBookFromPatronTable(book);

	// Change the book object to have a patron of 'null'

	    book.patron = null;

    }

}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array

	var name = document.getElementById('newPatronName').value;
	var patron = new Patron(name);
	patrons.push(patron);


	// Call addNewPatronEntry() to add patron to the DOM

	addNewPatronEntry(patron);

}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
    
	book = libraryBooks[document.getElementById('bookInfoId').value];

	// Call displayBookInfo()	

	displayBookInfo(book)

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	// referenced https://www.w3schools.com/jsref/met_table_insertrow.asp
	var table = document.getElementById("bookTable");
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);

    cell1.innerHTML = book.bookId;
    cell2.innerHTML = "<strong>" + book.title + "</strong>";
    cell3.innerHTML = book.patron;

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	var info = document.getElementById("bookInfo");
	var patron = "N/A";
	if(book.patron !== null){
		var patron = book.patron.name;
	}
	info.innerHTML = "<p>Book Id: <span>" + book.bookId + "</span></p>"
 		+ "<p>Title: <span>" + book.title + "</span></p>"
 		+ "<p>Author: <span>" + book.author + "</span></p>"
 		+ "<p>Genre: <span>" + book.genre + "</span></p>"
 		+ "<p>Currently loaned out to: <span>" + patron + "</span></p>";

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	// referenced https://stackoverflow.com/questions/15340840/get-all-elements-with-the-same-class
	var allTables = document.getElementsByClassName("patronLoansTable");
	var table = allTables[book.patron.cardNumber];
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = book.bookId;
    cell2.innerHTML = "<strong>" + book.title + "</strong>";
    cell3.innerHTML = "<span class='green'>Within due date</span>";
    cell4.innerHTML = "<button class='return'>return</button>";

    var bookTable = document.getElementById("bookTable");
	bookTable.deleteRow(book.bookId + 1);

	var row = bookTable.insertRow(book.bookId + 1);
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);

	cell1.innerHTML = book.bookId;
	cell2.innerHTML = "<strong>" + book.title + "</strong>";
	cell3.innerHTML = book.patron.cardNumber;

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status, and Return).
function addNewPatronEntry(patron) {
	var info = document.createElement('div');
	info.className = "patron";
	info.innerHTML = "<p>Name: <span class='bold'>" + patron.name + "</span></p>"
	 		+ "<p>Card Number: <span class='bold'>" + patron.cardNumber + "</span></p>"
	 		+ "<h4>Books on loan:</h4>"
	 		+ "<table class='patronLoansTable'>"
	 		+	"<tbody>"
			+ 		"<tr>"
			+ 			"<th>"
			+ 				"BookID"
			+ 			"</th>"
			+ 			"<th>"
			+ 				"Title"
			+ 			"</th>"
			+ 			"<th>"	
			+ 				"Status"
			+ 			"</th>"	
			+ 			"<th>"	
			+ 				"Return"
			+ 			"</th>"
			+ 		"</tr>"
		 	+	"</tbody>"
	 		+ "</table>";
	 
	 // referenced https://www.w3schools.com/jsref/met_node_appendchild.asp
	 document.getElementById("patrons").appendChild(info);

}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	// referenced https://stackoverflow.com/questions/15340840/get-all-elements-with-the-same-class
	var allTables = document.getElementsByClassName("patronLoansTable");
	if(book.patron !== null) {
		var patronTable = allTables[book.patron.cardNumber];
		patronTable.deleteRow(1);

		var bookTable = document.getElementById("bookTable");
		bookTable.deleteRow(book.bookId + 1);

		var row = bookTable.insertRow(book.bookId + 1);
		var cell1 = row.insertCell(0);
		var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(2);

		cell1.innerHTML = book.bookId;
		cell2.innerHTML = "<strong>" + book.title + "</strong>";
	}
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	// referenced https://stackoverflow.com/questions/15340840/get-all-elements-with-the-same-class
	var allTables = document.getElementsByClassName("patronLoansTable");
	var table = allTables[book.patron.cardNumber];
	table.deleteRow(1);
	var row = table.insertRow(-1);
	var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);

    cell1.innerHTML = book.bookId;
    cell2.innerHTML = "<strong>" + book.title + "</strong>";
    cell3.innerHTML = "<span class='red'>Overdue</span>";
    cell4.innerHTML = "<button class='return'>return</button>";

}

