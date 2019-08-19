(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

const getMpList = (searchResults) => {
  const mpList = searchResults.flat(2).filter((element) => {
    return (typeof element === 'string');
  })
  return [...new Set(mpList)];
}

const createClassName = (name) => {
  return name.toLowerCase().replace(/ /g,"_");
}

const locateAndFormatResults = (results) => {
  const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, null);
  let currentTextIndex = 0;
  const mpsPresent = convertResultsToObject(results);

  let nextMP = mpsPresent.shift()

  while(nextMP !== undefined) {
      // traverse node tree and locate text node containing next result
      const currentNode = treeWalker.currentNode.nodeName === '#text' ? treeWalker.currentNode : treeWalker.nextNode();
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

  const className = createClassName(result.name);
  const wrapper = document.createElement('span');

  wrapper.setAttribute(
    'style',
    'color: #62B356; cursor: pointer;'
  );
  wrapper.classList.add(className)
  range.surroundContents(wrapper);
};

const addClickEvent = (searchResults) => {
  const mpList = getMpList(searchResults);
  mpList.forEach(mpName => {
    let className = createClassName(mpName);

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

const mpList = findMps(mpArray);
locateAndFormatResults(mpList);
addClickEvent(mpList);
},{"./mpArray.json":2,"ahocorasick":3}],2:[function(require,module,exports){
module.exports=["Diane Abbott","Debbie Abrahams","Nigel Adams","Bim Afolami","Adam Afriyie","Peter Aldous","Rushanara Ali","Lucy Allan","Heidi Allen","Rosena Allin-Khan","Mike Amesbury","David Amess","Stuart Andrew","Tonia Antoniazzi","Edward Argar","Jon Ashworth","Victoria Atkins","Ian Austin","Richard Bacon","Kemi Badenoch","Adrian Bailey","Steven Baker","Harriett Baldwin","Stephen Barclay","Hannah Bardell","John Baron","Kevin Barron","Guto Bebb","Margaret Beckett","�rfhlaith Begley","Henry Bellingham","Hilary Benn","Richard Benyon","John Bercow","Paul Beresford","Luciana Berger","Jake Berry","Clive Betts","Mhairi Black","Ian Blackford","Bob Blackman","Kirsty Blackman","Roberta Blackman-Woods","Paul Blomfield","Crispin Blunt","Nicholas Boles","Peter Bone","Peter Bottomley","Andrew Bowie","Tracy Brabin","Ben Bradley","Karen Bradley","Ben Bradshaw","Graham Brady","Mickey Brady","Tom Brake","Suella Braverman","Kevin Brennan","Jack Brereton","Andrew Bridgen","Steve Brine","Deidre Brock","James Brokenshire","Alan Brown","Lyn Brown","Nick Brown","Fiona Bruce","Chris Bryant","Karen Buck","Robert Buckland","Richard Burden","Alex Burghart","Richard Burgon","Conor Burns","Alistair Burt","Dawn Butler","Liam Byrne","Vincent Cable","Ruth Cadbury","Alun Cairns","Lisa Cameron","Alan Campbell","Gregory Campbell","Ronnie Campbell","Dan Carden","Alistair Carmichael","James Cartlidge","Bill Cash","Maria Caulfield","Alex Chalk","Sarah Champion","Douglas Chapman","Jenny Chapman","Bambos Charalambous","Joanna Cherry","Rehman Chishti","Christopher Chope","Jo Churchill","Colin Clark","Greg Clark","Kenneth Clarke","Simon Clarke","James Cleverly","Geoffrey Clifton-Brown","Ann Clwyd","Vernon Coaker","Ann Coffey","Therese Coffey","Damian Collins","Julie Cooper","Rosie Cooper","Yvette Cooper","Jeremy Corbyn","Alberto Costa","Robert Courts","Ronnie Cowan","Geoffrey Cox","Neil Coyle","Stephen Crabb","David Crausby","Angela Crawley","Mary Creagh","Stella Creasy","Tracey Crouch","Jon Cruddas","John Cryer","Judith Cummins","Alex Cunningham","Jim Cunningham","Janet Daby","Nicholas Dakin","Edward Davey","Wayne David","Chris Davies","David Davies","Geraint Davies","Glyn Davies","Mims Davies","Philip Davies","David Davis","Martyn Day","Marsha de Cordova","Gloria De Piero","Thangam Debbonaire","Emma Dent Coad","Tanmanjeet Singh Dhesi","Caroline Dinenage","Jonathan Djanogly","Leo Docherty","Martin Docherty","Anneliese Dodds","Nigel Dodds","Jeffrey M. Donaldson","Michelle Donelan","Nadine Dorries","Steve Double","Stephen Doughty","Peter Dowd","Oliver Dowden","Jackie Doyle-Price","Richard Drax","David Drew","Jack Dromey","James Duddridge","Rosie Duffield","David Duguid","Alan Duncan","Iain Duncan Smith","Philip Dunne","Angela Eagle","Maria Eagle","Jonathan Edwards","Clive Efford","Julie Elliott","Michael Ellis","Louise Ellman","Tobias Ellwood","Chris Elmore","Charlie Elphicke","Bill Esterson","George Eustice","Chris Evans","Nigel Evans","David Evennett","Michael Fabricant","Michael Fallon","Paul Farrelly","Tim Farron","Marion Fellows","Frank Field","Mark Field","Jim Fitzpatrick","Colleen Fletcher","Caroline Flint","Lisa Forbes","Vicky Ford","Kevin Foster","Yvonne Fovargue","Liam Fox","Vicky Foxcroft","Mark Francois","Lucy Frazer","George Freeman","Mike Freer","James Frith","Gill Furniss","Marcus Fysh","Hugh Gaffney","Roger Gale","Mike Gapes","Barry Gardiner","Mark Garnier","David Gauke","Ruth George","Stephen Gethins","Nusrat Ghani","Nick Gibb","Patricia Gibson","Michelle Gildernew","Preet Kaur Gill","Cheryl Gillan","Paul Girvan","John Glen","Mary Glindon","Roger Godsiff","Zac Goldsmith","Helen Goodman","Robert Goodwill","Michael Gove","Patrick Grady","Luke Graham","Richard Graham","Bill Grant","Helen Grant","Peter Grant","James Gray","Neil Gray","Chris Grayling","Chris Green","Damian Green","Kate Green","Justine Greening","Lilian Greenwood","Margaret Greenwood","Dominic Grieve","Nia Griffith","Andrew Griffiths","John Grogan","Andrew Gwynne","Sam Gyimah","Louise Haigh","Kirstene Hair","Robert Halfon","Luke Hall","Fabian Hamilton","Philip Hammond","Stephen Hammond","Matthew Hancock","Greg Hands","David Hanson","Emma Hardy","Harriet Harman","Mark Harper","Richard Harrington","Carolyn Harris","Rebecca Harris","Trudy Harrison","Simon Hart","Helen Hayes","John Hayes","Sue Hayman","Christopher Hazzard","Oliver Heald","John Healey","James Heappey","Chris Heaton-Harris","Peter Heaton-Jones","Gordon Henderson","Mark Hendrick","Drew Hendry","Stephen Hepburn","Nick Herbert","Sylvia Hermon","Mike Hill","Meg Hillier","Damian Hinds","Simon Hoare","Wera Hobhouse","Margaret Hodge","Sharon Hodgson","Kate Hoey","Kate Hollern","George Hollingbery","Kevin Hollinrake","Philip Hollobone","Adam Holloway","Kelvin Hopkins","Stewart Hosie","George Howarth","John Howell","Lindsay Hoyle","Nigel Huddleston","Eddie Hughes","Jeremy Hunt","Rupa Huq","Nick Hurd","Imran Hussain","Alister Jack","Margot James","Christine Jardine","Dan Jarvis","Sajid Javid","Ranil Jayawardena","Bernard Jenkin","Andrea Jenkyns","Robert Jenrick","Boris Johnson","Caroline Johnson","Diana R. Johnson","Gareth Johnson","Jo Johnson","Andrew Jones","Darren Jones","David Jones","Gerald Jones","Graham Jones","Helen Jones","Kevan Jones","Marcus Jones","Ruth Jones","Sarah Jones","Susan Elan Jones","Mike Kane","Daniel Kawczynski","Gillian Keegan","Barbara Keeley","Liz Kendall","Seema Kennedy","Stephen Kerr","Afzal Khan","Ged Killen","Stephen Kinnock","Greg Knight","Julian Knight","Kwasi Kwarteng","Peter Kyle","Eleanor Laing","Lesley Laird","Ben Lake","Norman Lamb","David Lammy","John Lamont","Mark Lancaster","Pauline Latham","Ian Lavery","Chris Law","Andrea Leadsom","Karen Lee","Phillip Lee","Jeremy Lefroy","Edward Leigh","Chris Leslie","Oliver Letwin","Emma Lewell-Buck","Andrew Lewer","Brandon Lewis","Clive Lewis","Ivan Lewis","Julian Lewis","Ian Liddell-Grainger","David Lidington","David Linden","Emma Little Pengelly","Stephen Lloyd","Tony Lloyd","Rebecca Long-Bailey","Julia Lopez","Jack Lopresti","Jonathan Lord","Tim Loughton","Caroline Lucas","Ian Lucas","Holly Lynch","Craig Mackinlay","Rachel Maclean","Angus MacNeil","Justin Madders","Khalid Mahmood","Shabana Mahmood","Anne Main","Alan Mak","Seema Malhotra","Kit Malthouse","John Mann","Scott Mann","Gordon Marsden","Sandy Martin","Rachael Maskell","Paul Maskey","Paul Masterton","Chris Matheson","Theresa May","Paul Maynard","Steve McCabe","Elisha McCallion","Kerry McCarthy","Siobhain McDonagh","Andy McDonald","Stewart McDonald","Stuart McDonald","John McDonnell","Pat McFadden","Conor McGinn","Alison McGovern","Liz McInnes","Catherine McKinnell","Patrick McLoughlin","Jim McMahon","Anna McMorrin","John McNally","Stephen McPartland","Esther McVey","Ian Mearns","Mark Menzies","Johnny Mercer","Huw Merriman","Stephen Metcalfe","Ed Miliband","Maria Miller","Amanda Milling","Nigel Mills","Anne Milton","Andrew Mitchell","Francie Molloy","Carol Monaghan","Madeleine Moon","Damien Moore","Layla Moran","Penny Mordaunt","Jessica Morden","Nicky Morgan","Stephen Morgan","Anne Marie Morris","David Morris","Grahame Morris","James Morris","Wendy Morton","David Mundell","Ian Murray","Sheryll Murray","Andrew Murrison","Lisa Nandy","Bob Neill","Gavin Newlands","Sarah Newton","Caroline Nokes","Jesse Norman","Alex Norris","Neil O'Brien","Brendan O'Hara","Jared O'Mara","Matthew Offord","Melanie Onn","Chi Onwurah","Guy Opperman","Kate Osamor","Albert Owen","Ian Paisley Jnr","Neil Parish","Priti Patel","Owen Paterson","Mark Pawsey","Stephanie Peacock","Teresa Pearce","Mike Penning","Matthew Pennycook","John Penrose","Andrew Percy","Toby Perkins","Claire Perry","Jess Phillips","Bridget Phillipson","Chris Philp","Laura Pidcock","Christopher Pincher","Jo Platt","Luke Pollard","Daniel Poulter","Steve Pound","Rebecca Pow","Lucy Powell","Victoria Prentis","Mark Prisk","Mark Pritchard","Tom Pursglove","Jeremy Quin","Will Quince","Yasmin Qureshi","Dominic Raab","Faisal Rashid","Angela Rayner","John Redwood","Steve Reed","Christina Rees","Jacob Rees-Mogg","Ellie Reeves","Rachel Reeves","Emma Reynolds","Jonathan Reynolds","Marie Rimmer","Laurence Robertson","Gavin Robinson","Geoffrey Robinson","Mary Robinson","Matt Rodda","Andrew Rosindell","Douglas Ross","Danielle Rowley","Lee Rowley","Chris Ruane","Amber Rudd","Lloyd Russell-Moyle","David Rutley","Joan Ryan","Antoinette Sandbach","Liz Saville-Roberts","Paul Scully","Bob Seely","Andrew Selous","Naseem Shah","Jim Shannon","Grant Shapps","Alok Sharma","Virendra Sharma","Barry Sheerman","Alec Shelbrooke","Tommy Sheppard","Paula Sherriff","Gavin Shuker","Tulip Siddiq","David Simpson","Keith Simpson","Chris Skidmore","Dennis Skinner","Andrew Slaughter","Ruth Smeeth","Angela Smith","Cat Smith","Chloe Smith","Eleanor Smith","Henry Smith","Jeff Smith","Julian Smith","Laura Smith","Nick Smith","Owen Smith","Royston Smith","Karin Smyth","Gareth Snell","Nicholas Soames","Alex Sobel","Anna Soubry","John Spellar","Caroline Spelman","Mark Spencer","Keir Starmer","Chris Stephens","Andrew Stephenson","Jo Stevens","John Stevenson","Bob Stewart","Iain Stewart","Rory Stewart","Jamie Stone","Gary Streeter","Wes Streeting","Mel Stride","Graham Stringer","Graham Stuart","Julian Sturdy","Rishi Sunak","Desmond Swayne","Paul Sweeney","Jo Swinson","Hugo Swire","Robert Syms","Mark Tami","Alison Thewliss","Derek Thomas","Gareth Thomas","Nick Thomas-Symonds","Ross Thomson","Emily Thornberry","Maggie Throup","Stephen Timms","Kelly Tolhurst","Justin Tomlinson","Michael Tomlinson","Craig Tracey","David Tredinnick","Anne-Marie Trevelyan","Jon Trickett","Elizabeth Truss","Thomas Tugendhat","Anna Turley","Karl Turner","Derek Twigg","Stephen Twigg","Liz Twist","Chuka Umunna","Ed Vaizey","Shailesh Vara","Keith Vaz","Valerie Vaz","Martin Vickers","Theresa Villiers","Charles Walker","Robin Walker","Thelma Walker","Ben Wallace","David Warburton","Matt Warman","Giles Watling","Tom Watson","Catherine West","Matt Western","Helen Whately","Heather Wheeler","Alan Whitehead","Martin Whitfield","Philippa Whitford","Craig Whittaker","John Whittingdale","Bill Wiggin","Hywel Williams","Paul Williams","Chris Williamson","Gavin Williamson","Phil Wilson","Sammy Wilson","Rosie Winterton","Pete Wishart","Sarah Wollaston","Mike Wood","John Woodcock","William Wragg","Jeremy Wright","Mohammad Yasin","Nadhim Zahawi","Daniel Zeichner"]
},{}],3:[function(require,module,exports){
(function() {
    'use strict';

    var AhoCorasick = function(keywords) {
        this._buildTables(keywords);
    };

    AhoCorasick.prototype._buildTables = function(keywords) {
        var gotoFn = {
            0: {}
        };
        var output = {};

        var state = 0;
        keywords.forEach(function(word) {
            var curr = 0;
            for (var i=0; i<word.length; i++) {
                var l = word[i];
                if (gotoFn[curr] && l in gotoFn[curr]) {
                    curr = gotoFn[curr][l];
                }
                else {
                    state++;
                    gotoFn[curr][l] = state;
                    gotoFn[state] = {};
                    curr = state;
                    output[state] = [];
                }
            }

            output[curr].push(word);
        });

        var failure = {};
        var xs = [];

        // f(s) = 0 for all states of depth 1 (the ones from which the 0 state can transition to)
        for (var l in gotoFn[0]) {
            var state = gotoFn[0][l];
            failure[state] = 0;
            xs.push(state);
        }

        while (xs.length) {
            var r = xs.shift();
            // for each symbol a such that g(r, a) = s
            for (var l in gotoFn[r]) {
                var s = gotoFn[r][l];
                xs.push(s);

                // set state = f(r)
                var state = failure[r];
                while(state > 0 && !(l in gotoFn[state])) {
                    state = failure[state];
                }

                if (l in gotoFn[state]) {
                    var fs = gotoFn[state][l];
                    failure[s] = fs;
                    output[s] = output[s].concat(output[fs]);
                }
                else {
                    failure[s] = 0;
                }
            }
        }

        this.gotoFn = gotoFn;
        this.output = output;
        this.failure = failure;
    };

    AhoCorasick.prototype.search = function(string) {
        var state = 0;
        var results = [];
        for (var i=0; i<string.length; i++) {
            var l = string[i];
            while (state > 0 && !(l in this.gotoFn[state])) {
                state = this.failure[state];
            }
            if (!(l in this.gotoFn[state])) {
                continue;
            }

            state = this.gotoFn[state][l];

            if (this.output[state].length) {
                var foundStrs = this.output[state];
                results.push([i, foundStrs]);
            }
        }

        return results;
    };

    if (typeof module !== 'undefined') {
        module.exports = AhoCorasick;
    }
    else {
        window.AhoCorasick = AhoCorasick;
    }
})();

},{}]},{},[1]);
