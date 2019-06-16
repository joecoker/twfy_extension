'use strict'

const fs = require('fs');
const politiciansJSON = require('./politician.json')

// let jsonObj = JSON.parse(politiciansJSON);

let filteredList = politiciansJSON.map(polObject => {
  if (polObject.fullName && polObject.givenName && polObject.familyName) {
    if (polObject.fullName['_value'].includes('Lord')) {
      let lordUrl = polObject.fullName['_value'].split(' ').join('_')
  
      let lordObj = {
        fullName: polObject.givenName['_value'] + ' ' + polObject.familyName['_value'],
        lordName: polObject.fullName['_value'],
        urlName: lordUrl.toLowerCase()
      }
      return lordObj
    }
    else {
      let mpObj = {
        fullName: polObject.givenName['_value'] + ' ' + polObject.familyName['_value'],
        urlName: polObject.givenName['_value'].toLowerCase() + '_' + polObject.familyName['_value'].toLowerCase()
      }
      return mpObj
    } 
  }
})

let jsonContent = JSON.stringify(filteredList)

fs.writeFile('pol.json', jsonContent, 'utf8', function(err) {
  if (err) {
    console.log("An error occured while writing JSON Object to File.")
  return console.log(err)
  }
  console.log("JSON file has been saved");
})