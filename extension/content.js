'use strict'
const AhoCorasick = require('ahocorasick');
const mpJSON = require('./mp.json');
const mpArray = require('./mpArray.json')

let startTime = performance.now();

function sendToBackground(id) {
  chrome.runtime.sendMessage(id);
}

function addClickEvent(classArray) {
  classArray.forEach(className => {
    let classList = document.getElementsByClassName(className)

    Array.from(classList).forEach(element => {
      element.addEventListener('click', function(event) {
        event.preventDefault()
        event.stopPropagation();
        sendToBackground(className);
      });
    });
  });
}

// function highlightText(mpJSON) {
//   let classArray = [];
  
//   mpJSON.forEach(mpObj => {
//     let name = mpObj.mpFullName;
//     let className = mpObj.mpId;
//     let nameRegex = new RegExp(name, 'g');

//     if(document.body.innerHTML.includes(name)) {
//       let profileLink = "<span href=# class=" + className + " style='color: #62B356'>" + name + "</span>";

//       document.body.innerHTML = document.body.innerHTML.replace(nameRegex, profileLink);
//       classArray.push(className)
//     };
//   });

//   addClickEvent(classArray)
// }

function highlightTextAC(mpArray) {
  let ac = new AhoCorasick(mpArray)

  let results = ac.search(document.body.innerText)

  let mpList = results.flat(2).filter((element) => {
    return (typeof element == 'string');
  })

  let uniqueMPList = [...new Set(mpList)];

  let classArray = []

  // Need to see which websites it can run and cant run on

  // Clean up

  for(let i = 0; i < uniqueMPList.length; i++) {
    let name = uniqueMPList[i]
    let className = name.toLowerCase().replace(/ /g,"_");
    let nameRegex = new RegExp(name, 'g');

    let profileLink = "<span href=# class=" + className + " style='color: #62B356'>" + name + "</span>";
    document.body.innerHTML = document.body.innerHTML.replace(nameRegex, profileLink);
    classArray.push(className)
  }

  addClickEvent(classArray)
}

// highlightText(mpJSON);

highlightTextAC(mpArray);

let finishTime = performance.now();

console.log("Content script took " + (finishTime - startTime) + " milliseconds to run")