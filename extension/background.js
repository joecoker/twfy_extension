'use strict'

chrome.runtime.onMessage.addListener(openWindow);

function openWindow(request, sender, sendResponse) {
  chrome.tabs.create({
    url: request,
    active: false
  })
}