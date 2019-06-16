'use strict'
const politiciansJSON = require('./pol.json');

function sendToBackground(politicianName) {
  chrome.runtime.sendMessage(politicianName);
}

function highlightText(politiciansJSON) {
  politiciansJSON.forEach(politicianObj => {
    console.log(politicianObj);
    let politicianUrl = politicianObj.urlName
    let politicianName = politicianObj.fullName

    if(document.body.innerHTML.includes(politicianName)) {
      let profileLink = "<a href=# id=" + politicianUrl + " style='color: #62B356'>" + politicianName + "</a>";
      document.body.innerHTML = document.body.innerHTML.replace(new RegExp(politicianName, 'g'), profileLink);
    
      document.getElementById(politicianUrl).addEventListener('click', function() {
      sendToBackground(politicianUrl)
      });
    };
  });
}


highlightText(politiciansJSON);

