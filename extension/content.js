'use strict'
const mpJSON = require('./mp.json');

function sendToBackground(id) {
  chrome.runtime.sendMessage(id);
}

function addClickEvent(classArray) {
  classArray.forEach(className => {
    let classList = document.getElementsByClassName(className)

    Array.from(classList).forEach(element => {
      element.addEventListener('click', function() {
        sendToBackground(className);
      });
    });
  });
}

function highlightText(mpJSON) {
  let classArray = [];

  mpJSON.forEach(mpObj => {
    let name = mpObj.mpFullName;
    let className = mpObj.mpId;

    if(document.body.innerHTML.includes(name)) {
      let profileLink = "<a href=# class=" + className + " style='color: #62B356'>" + name + "</a>";
      document.body.innerHTML = document.body.innerHTML.replace(new RegExp(name, 'g'), profileLink);
      classArray.push(className)
    };
  });

  addClickEvent(classArray)
}

highlightText(mpJSON);

