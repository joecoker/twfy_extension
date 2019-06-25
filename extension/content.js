'use strict'
const mpJSON = require('./mp.json');

function sendToBackground(id) {
  chrome.runtime.sendMessage(id);
}

function addClickEvent(classArray) {
  classArray.forEach(className => {
    let classList = document.getElementsByClassName(className)

    Array.from(classList).forEach(element => {
      element.addEventListener('click', function(event) {
        console.log(event);
        event.preventDefault()
        event.stopPropagation();
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
    let nameRegex = new RegExp(name, 'g');

    if(document.body.innerHTML.includes(name)) {
      let profileLink = "<span href=# class=" + className + " style='color: #62B356'>" + name + "</span>";

      document.body.innerHTML = document.body.innerHTML.replace(nameRegex, profileLink);
      classArray.push(className)
    };
  });

  addClickEvent(classArray)
}

highlightText(mpJSON);

