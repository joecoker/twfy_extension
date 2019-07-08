'use strict';

const fs = require('fs');
const polJson = require('./pol.json')
// RE this data file^, it's convention in json to use camelCase for data
// Slightly longer, more descriptive names would be nicer for files


// i think parsing the json into javascript first, JSON.parse(), would make it easier to deal with

let nameArray = polJson.map(polObject => {
  let mpFullName = polObject['First name'] + " " + polObject['Last name'];

  return mpFullName;

  // once its parsed and re-named you could just do this: 
  // return `${mp.firstName} ${mp.lastName}`
})

console.log(nameArray)
// May wanna get rid of all of the console logs?

let jsonArray = JSON.stringify(nameArray) // such a vague name

fs.writeFile('mpArray.json', jsonArray, 'utf8', function(err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.")
  return console.log(err)
  }
  console.log("JSON file has been saved");
})