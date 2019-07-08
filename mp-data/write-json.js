'use strict'

const fs = require('fs');
const polJson = require('./pol.json')

// let jsonObj = JSON.parse(politiciansJSON);

let filteredList = polJson.map(polObject => {
  let mpObj = {
    mpFullName: polObject['First name'] + " " + polObject['Last name'],
    mpUrl: polObject['URI'],
    mpId: polObject['First name'].toLowerCase() + "_" + polObject['Last name'].toLowerCase()
  }

  return mpObj
 
})

let jsonContent = JSON.stringify(filteredList)

fs.writeFile('mp.json', jsonContent, 'utf8', function(err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.")
  return console.log(err)
  }
  console.log("JSON file has been saved");
})