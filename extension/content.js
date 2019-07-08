'use strict'
const AhoCorasick = require('ahocorasick');
const mpArray = require('./mpArray.json')

function sendToBackground(id) {
  chrome.runtime.sendMessage(id);
}
// test comment
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

function highlightText(uniqueMPList) {
  let classArray = []

  for(let i = 0; i < uniqueMPList.length; i++) {
    let name = uniqueMPList[i]
    let className = name.toLowerCase().replace(/ /g,"_");

    let nameRegex = new RegExp(name, 'g');

    let profileLink = "<span href=# class=" + className + " style='color: #62B356; cursor: pointer'>" + name + "</span>";
    document.body.innerHTML = document.body.innerHTML.replace(nameRegex, profileLink);
    classArray.push(className)
  }

  addClickEvent(classArray)
}

function findMps(mpArray) {
  let ac = new AhoCorasick(mpArray) 
  let results = ac.search(document.body.innerText)
  
  let mpList = results.flat(2).filter((element) => {
    return (typeof element == 'string');
  })

  let uniqueMPList = [...new Set(mpList)];

  if (uniqueMPList.length > 100) {
    return
  } 
  else {
    highlightText(uniqueMPList)
  }
}

findMps(mpArray);

