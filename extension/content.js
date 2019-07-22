const AhoCorasick = require('ahocorasick');
const mpArray = require('./mpArray.json');

const sendToBackground = (id) => {
    chrome.runtime.sendMessage(id);
}

const findMps = (mpArray) => {
  const ahoCorasickInstance = new AhoCorasick(mpArray);
  return ahoCorasickInstance.search(document.body.textContent);
}

const convertResultsToObject = (results) => {
  const mpObjects = results.map(result => {
    return {
      name: result[1][0],
      index: result[0]
    }
  });

  return mpObjects;
}

const addClickEvent = (searchResults) => {
  const mpList = getMpList(searchResults);
  mpList.forEach(mpName => {
    let className = mpName.toLowerCase().replace(/ /g,"_");

    let classList = document.getElementsByClassName(className);

    Array.from(classList).forEach(element => {
      element.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        sendToBackground(className);
      });
    });
  });
}

const getMpList = (searchResults) => {
  const mpList = searchResults.flat(2).filter((element) => {
    return (typeof element === 'string');
  })

  return [...new Set(mpList)];
}

// rootNode starts off as document.body
const locateAndFormatResults = (results) => {
  const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, null);
  let currentTextIndex = 0;

  const mpsPresent = convertResultsToObject(results);

  let nextMP = mpsPresent.shift()

  while(nextMP !== undefined) {
  // Have converted this to a loop through results but the text index is too small 
      // traverse node tree and locate text node containing next result
      const currentNode = treeWalker.currentNode.nodeName === '#text'
                            ? treeWalker.currentNode
                            : treeWalker.nextNode();

      const nodeTextLength = currentNode.textContent.length;

      const nodeIncludesNextResult = currentTextIndex + nodeTextLength >= nextMP.index;

      if (nodeIncludesNextResult) {
      // do not reformat text nodes within script and style elements, these are not displayed to the user
        const parentNodeName = currentNode.parentNode.nodeName;

        const parentNodeIsValid = parentNodeName !== 'SCRIPT' &&  parentNodeName !== 'STYLE' && parentNotAnchor(currentNode);

        if (parentNodeIsValid) {

          highlightResult(nextMP, currentNode, currentTextIndex);
        }

        nextMP = mpsPresent.shift();
      } 
      
      else {
      currentTextIndex += nodeTextLength;
      treeWalker.nextNode();
      }
   }
}

const parentNotAnchor = (currentNode) => {
  for (; currentNode && currentNode != document; currentNode = currentNode.parentNode) {
    if (currentNode.nodeName === 'A') {
      return false
    }
  }

  return true;
}

const highlightResult = (result, node, currentTextIndex) => {
  const resultEndOffset = result.index - currentTextIndex + 1;
  const resultStartOffset = resultEndOffset - result.name.length;

  const range = document.createRange();

  range.setStart(node, resultStartOffset);
  range.setEnd(node, resultEndOffset);

  const className = result.name.toLowerCase().replace(/ /g,"_");

  const wrapper = document.createElement('span');
  wrapper.setAttribute(
    'style',
    'color: #62B356; cursor: pointer;'
  );
  wrapper.classList.add(className)
  range.surroundContents(wrapper);
};


const mpList = findMps(mpArray);
locateAndFormatResults(mpList);
addClickEvent(mpList);