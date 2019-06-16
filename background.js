'use strict'

chrome.runtime.onMessage.addListener(openWindow);

function openWindow(request, sender, sendResponse) {
  chrome.tabs.create({
    url: 'https://www.theyworkforyou.com/mp/' + request
  })
}