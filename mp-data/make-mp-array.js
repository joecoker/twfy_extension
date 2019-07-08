'use strict';

const fs = require('fs');
const polJson = require('./pol.json')

let nameArray = polJson.map(polObject => {
  let mpFullName = polObject['First name'] + " " + polObject['Last name'];

  return mpFullName;
})

console.log(nameArray)

let jsonArray = JSON.stringify(nameArray)

fs.writeFile('mpArray.json', jsonArray, 'utf8', function(err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.")
  return console.log(err)
  }
  console.log("JSON file has been saved");
})