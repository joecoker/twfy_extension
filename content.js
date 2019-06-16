'use strict'

function sendToBackground(politicianName) {
  chrome.runtime.sendMessage(politicianName);
}

function highlightText() {
  let politicianName = 'boris_johnson'

  let infoButton = "<a href=# id=" + politicianName + " style='color: #62B356'>BOJO</a>";
  document.body.innerHTML = document.body.innerHTML.replace(new RegExp('Boris Johnson', 'g'), infoButton);
  
  document.getElementById(politicianName).addEventListener('click', function() {
    sendToBackground(politicianName)
  });
}


highlightText();

