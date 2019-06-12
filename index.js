'use strict';
const apiKey = "eiwem2A2TLAOGMciyk0nXJisnVYF6DO4yF1gvTqE";
const listUrl = "https://developer.nps.gov/api/v1/parks";
let stateSearch = [];

//format the searchState, with respective key value pair and returns a URL string 
function formatQueryparam(para) {
   const queryItems = Object.keys(para)
   .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(para[key])}`);
   const state = stateSearch.join(',');
   return queryItems.join('&') + '&stateCode=' + state;
   
}

//display results to page: 
function displayParks(responseJson) {
    console.log(responseJson);
    $('#results').empty();
    $('#js-error-message').empty();
    //iterating through the response array
    for(let i = 1; i<responseJson.data.length; i++) {
        $('#results').append(
       `<li><p>Park name: ${responseJson.data[i].fullName}</p>
            <p>Park description: ${responseJson.data[i].description}</p>
            <p>Park url: ${responseJson.data[i].url}</p>
        </li>`
        )}
    $('#results').removeClass('hidden');
}

//func sets up nps api promise
function getParks(maxLimit=10) {
    //key in para extracted from API doc
    const para = {
        limit: maxLimit,
        api_key: apiKey,
    };
    const queryString = formatQueryparam(para);
    const url = listUrl + '?' + queryString;
    console.log(url);
    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText || "Please enter valid 2 digit state code");
    })
    .then (responseJson => displayParks(responseJson))
    .catch(err => {
        $('#js-error-message').text(`Oops you have an error: ${err}`);
        $('.results').removeClass('hidden');  
    });
}

//stops the default behavior, triggers on clicking submit. user input stored 
//in  variables passed to getParks()
function watchForm() {
    $('#submitBtn').click(event=>{
        event.preventDefault()
        let state = $('#js-getState').val();
        let maxLimit = $('#js-getMax').val();
        stateSearch = [state];
        getParks(maxLimit);
        
    });
}

//additional search by state button 
$('#additional-state').on('click', function (event){
    event.preventDefault();
    let state = $('#js-getState').val();
    let maxLimit = $('#js-getMax').val();
    stateSearch.push(state);
    getParks(maxLimit);
})

//calls watchFrom() when app loads
$(function() {
    console.log("App ready, waiting for user entry");
    watchForm();
})