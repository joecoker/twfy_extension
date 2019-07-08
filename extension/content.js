'use strict'
const AhoCorasick = require('ahocorasick');
const mpArray = require('./mpArray.json')

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

function addClickEventToElement(className) {
  let classList = document.getElementsByClassName(className)

  Array.from(classList).forEach(element => {
    element.addEventListener('click', function (event) {
      event.preventDefault()
      event.stopPropagation();
      sendToBackground(className);
    });
  })
}

function highlightText(uniqueMPList) {
  let classArray = [] // What actually is classArray? stay away from naming stuff somethingArray.

  // 'for' in javascript is pretty old school, try and use es6 functions like, map, filter, forEach, reduce etc. I think 'map' is what you need here
  for(let i = 0; i < uniqueMPList.length; i++) {
    let name = uniqueMPList[i] // use const!
    let className = name.toLowerCase().replace(/ /g,"_");

    let nameRegex = new RegExp(name, 'g');

    let profileLink = "<span href=# class=" + className + " style='color: #62B356; cursor: pointer'>" + name + "</span>";

    // es6 syntax for strings is better eg.
    // const profileLink = `<span href=# class=${className}style='color: #62B356; cursor: pointer'>${name}</span>`;


    document.body.innerHTML = document.body.innerHTML.replace(nameRegex, profileLink);
    classArray.push(className) // push is a mutable js function (best avoided when possible), use map here to build your new array.
    
    // could the event listener be added directly to each element? without passing through the whole array? likeeee:
    // addClickEventToElement(className)

  }

  addClickEvent(classArray)

}

function findMps(mpArray) {
  let ac = new AhoCorasick(mpArray)  // use const
  // potentially name this ahoCorasickInstance

  let results = ac.search(document.body.innerText)
  
  let mpList = results.flat(2).filter((element) => {
    return (typeof element == 'string'); // don't use ==, only ===
  })

  let uniqueMPList = [...new Set(mpList)];


  // Cant this... 
  if (uniqueMPList.length > 100) {
    return
  } 
  else {
    highlightText(uniqueMPList)
  }
  
  // be this?
  // if (uniqueMPList.length <= 100) {
  //   highlightText(uniqueMPList)
  // }  
}

findMps(mpArray);

// You can self invoke functions like:
(function () {
  // body of the function
}());
