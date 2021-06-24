//url for the The Random User Generator API
const userCount = 12;
const url = "https://randomuser.me/api/?results=" + userCount;

//fetch request for the random users--------------------
fetch(url)
.then(result => result.json())
.then(data => console.log(data.results));




//helper functions to display on webpage------------------






// function fetchUser(url) {
//   return fetch(url)
//           .then(result => result.json())
//           .then(data => console.log(data.results[0]));
// }
//
//
// fetchUser(url);


//console.log(fetchUser(url));
