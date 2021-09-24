//url for the The Random User Generator API
const userCount = 20;
const nationality = "us";
const url = `https://randomuser.me/api/?nat=${nationality}&results=${userCount}`;

//selecting the DOM elements
const gallery = document.querySelector("#gallery");
const body = document.querySelector("#gallery");
const status = document.querySelector("#status");

//this will store the data that we get from the fetch request
var employees = [];
//this will store the current search results
var searchResults = [];
//this will be true if we are using the search feature currently
var searchMode = false;




//API fetch request for the random users--------------------
fetch(url)
.then(result => result.json())
.then(data => {employees = data.results})
.finally( () => {
  //calling all functions here
  createGallery(employees);
  setUpSearch();
})
.catch((error) => { status.innerHTML = `Whoops! There was an issue with the API request! ${error}`});


//This function creates the gallery in cards that displays basic information----------
function createGallery(items) {

  //clear any previous galleries, to prevent DUPLICATING
  gallery.innerHTML = '';

  items.forEach((item, index) => {
    //loop through each employee and create the gallery cards!
    //console.log(index);
    let htmlToAdd = `<div class="card">
                        <div class="card-img-container">
                            <img class="card-img" src="${item.picture.medium}" alt="profile picture">
                        </div>
                        <div class="card-info-container">
                            <h3 id="name" class="card-name cap">${item.name.first} ${item.name.last}</h3>
                            <p class="card-text">${item.email}</p>
                            <p class="card-text cap">${item.location.city}, ${item.location.state}</p>
                        </div>
                    </div>`;

    //add to the webpage
    gallery.insertAdjacentHTML('beforeend', htmlToAdd);
  });

  //clear the status
  status.innerHTML = '';

  //call this function to set up the modal views
  setUpModal();
}

//this function will add event listeners to the cards, and generate the appropriate modals
function setUpModal() {

  //select all cards and add event listener to open modal
  const cards = document.querySelectorAll(".card");
  cards.forEach((card, index) => {
    card.addEventListener('click', (event) =>{
      createModal(index);
    });
  });


}


//This function will create the modal view for the employee specified in the index of the employee array
function createModal(index) {

  //is there already a modal showing? let's clear before proceeding
  const modalCheck = document.querySelector(".modal-container");
  if (modalCheck) {
    modalCheck.remove();
  }

  //are we using the employees array or only the search results?
  let targetArray = (searchMode) ? searchResults : employees;

  //html code to be added to the webpage
  let htmlToAdd = `<div class="modal-container">
                    <div class="modal">
                        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                        <div class="modal-info-container">
                            <img class="modal-img" src="${targetArray[index].picture.large}" alt="profile picture">
                            <h3 id="name" class="modal-name cap">${targetArray[index].name.first} ${targetArray[index].name.last}</h3>
                            <p class="modal-text">${targetArray[index].email}</p>
                            <p class="modal-text cap">${targetArray[index].location.city}</p>
                            <hr>
                            <p class="modal-text">${formatPhoneNumber(targetArray[index].phone)}</p>
                            <p class="modal-text">${targetArray[index].location.street.number} ${targetArray[index].location.street.name}, ${targetArray[index].location.city}, ${targetArray[index].location.state} ${targetArray[index].location.postcode}</p>
                            <p class="modal-text">Birthday: ${formatDate(targetArray[index].dob.date)}</p>
                        </div>
                    </div>
                    <div class="modal-btn-container">
                        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                        <button type="button" id="modal-next" class="modal-next btn">Next</button>
                    </div>
                </div>`

  //inserting after end of gallery
  gallery.insertAdjacentHTML('afterend', htmlToAdd);

  //get new recently added DOM elements
  const modal = document.querySelector(".modal-container");
  const closeButton = document.querySelector(".modal-close-btn");
  const nextButton = document.querySelector(".modal-next");
  const prevButton = document.querySelector(".modal-prev");

  //add event listener to the close button
  closeButton.addEventListener('click', (event) =>{
    modal.remove();
  });


  //add event listener to the modal previous and next buttons
  //disable if they are at beggining or end of index
  if (index === targetArray.length - 1) {
    nextButton.disabled = true;
  } else {
    nextButton.addEventListener('click', (event) =>{
      createModal(++index);
    });
  }

  if (index === 0) {
    prevButton.disabled = true;
  } else {
    prevButton.addEventListener('click', (event) =>{
      createModal(--index);
    });
  }

}

//will set up the search bar and functionallity
function setUpSearch() {
  let htmlToAdd = `<form action="#" method="get">
                      <input type="search" id="search-input" class="search-input" placeholder="Search...">
                      <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                   </form>`

  document.querySelector(".search-container").insertAdjacentHTML('beforeEnd', htmlToAdd);


  //function to be used when searching, used by two event listeners
  //Pretty much borrowed it from Project 2. Shhhhhh
  function search(query) {

    //reset if empty
    if (query.length == 0) {
      searchMode = false;
      createGallery(employees);
      return
    }

    //turn on search mode! (used in the modal view)
    searchMode = true;

    //convert to lower case
    query = query.toLowerCase();

    //clear the search results array
    searchResults = [];

    //loop through the names to find matches
    for (let i = 0; i < employees.length; i++) {

      //combine fist and last names
      let firstLastName = `${employees[i].name.first} ${employees[i].name.last}`.toLowerCase();

      if (firstLastName.includes(query)) {
        //match found!!
        searchResults.push(employees[i]);
      }

      //show results & check if no results found
      if (searchResults.length > 0) {
        createGallery(searchResults);
      } else {
        //no results found!! Dusplay a message
        status.innerHTML = "Sorry, no search results found."

        //clear prior Gallery
        gallery.innerHTML = '';
      }
    }
  }

  //add event listener for names typed in
  const searchLabel = document.querySelector(".search-input");
  searchLabel.addEventListener('keyup', (event) => {
    search(event.target.value);
  });

  //add event listener for search button being clicked
  const searchButton = document.querySelector(".search-submit");
  searchButton.addEventListener('click', (event) => {
    search(searchLabel.value);
  });

}

//used to format the dob
function formatDate(dateString) {
  const fecha = new Date(dateString);
  return `${fecha.getMonth() + 1}/${fecha.getDate()}/${fecha.getFullYear()}`
}


//used for formatting phone numbers
//code adapted from https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumberString;
}
