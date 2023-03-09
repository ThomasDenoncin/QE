var debug = true;

var charList = {
    'ali' : {
        'tags': 'homme garçon lunette barbe chauve brun jeune',
    },
    'alice' : {
        'tags': 'femme fille lunette long brun jeune',
    },
    'amelia': {
        'tags': 'femme fille lunette attaché long blond jeune',
    },
    'amy': {
        'tags': 'femme fille bouclé court chatain jeune',
    },
    'graziela': {
        'tags': 'femme fille attaché long chatain jeune',
    },
    'jason': {
        'tags': 'homme garçon court blond jeune',
    },
    'john': {
        'tags': 'homme garçon lunette barbe chauve blanc gris vieux',
    },
    'juno': {
        'tags': 'femme fille attaché court brun jeune',
    },
    'mathias': {
        'tags': 'homme garçon lunette court chatain jeune',
    },
    'philippe': {
        'tags': 'homme garçon barbe court blanc gris vieux',
    },
    'tina': {
        'tags': 'femme fille court rou jeune',
    },
    'vincent': {
        'tags': 'homme garçon barbe court brun gris vieux',
    }
};

var tags = ['lunette', 'long', 'chauve', 'court', 'bouclé', 'attaché', 'barbe', 'homme' ,'garçon', 'femme', 'fille' ];

var char = null;

var ins = {};

var init = function() {
    let container = document.querySelector('.container');
    
    for (let char in charList) {
        let caption = document.createElement('div');
        caption.setAttribute('id', char);
        caption.setAttribute('class', 'caption');
        caption.setAttribute('style', 'background-image: url(assets/img/'+ char +'.jpg);');

        let title = document.createElement('div');
        title.setAttribute('class', 'caption-title');
        
        let text = document.createTextNode(char);

        title.appendChild(text);
        caption.appendChild(title);
        container.appendChild(caption);
    }

    char = randomChar(charList);
    if (debug) console.log('char:', char);

    let button = document.querySelector('.walid');
    let input = document.querySelector('.question');
    let response = document.querySelector('.response');

    button.addEventListener('click', function(e) {
        let keyWords = input.value;
        if (debug) console.log('keywords:', keyWords);
        let isTry = checkTry(keyWords);
        if (debug) console.log('istry:', isTry);

        if (isTry) {
            let message = '';
            let buttonMessage = '';
            if (isTry === char) {
                message = '<strong class="true">C\'est bien ' + char.toUpperCase() + ' ! Bien joué !</strong>';
                buttonMessage = 'Jouer à nouveau';
            } else {
                message = '<strong class="false">Désolé ! Ce n\'est pas ' + isTry.toUpperCase() + ' !</strong>';
                buttonMessage = 'Essayer à nouveau';
            }

            let reloadButton = document.createElement('input');
            reloadButton.setAttribute('type', 'button');
            reloadButton.setAttribute('class', 'btn btn--secondary');
            reloadButton.setAttribute('value', buttonMessage);
            reloadButton.setAttribute('onclick', 'document.location.reload()');

            response.innerHTML = message;
            input.remove();
            button.remove();
            document.querySelector('.form').appendChild(reloadButton);

        } else {
            let expectedResult = hasKeyWords(keyWords, charList[char].tags.split(' '));
            if (debug) console.log('expectedresult:', expectedResult);
            let checkList = (ins.length > 0)? ins : charList;
            if (debug) console.log('checklist:', checkList);
            
            for (const [char, obj] of Object.entries(checkList)) {
                let result = hasKeyWords(keyWords, obj.tags.split(' '));
                if ((result === expectedResult) && !ins.hasOwnProperty(char)) {
                    ins[char] = obj;
                } else if ((result !== expectedResult) && ins.hasOwnProperty(char)) {
                    delete ins[char];
                }
            }

            for (let char in charList) {
                if (!ins.hasOwnProperty(char)) {
                    document.getElementById(char).classList.add('not');
                }
            }

            let responseText = (expectedResult) ? 'Oui' : 'Non';
            response.innerHTML = input.value + ' <strong class="' + expectedResult.toString() + '">' + responseText + '</strong>';     
            input.value = '';
        }
    });

    input.addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
            button.click();
        }
    });

    input.focus();
};

var randomChar = function (obj) {
    var keys = Object.keys(obj)
    return keys[keys.length * Math.random() << 0];
};

var hasKeyWords = function (keys, tags) {
    let result = false;
    for (let tag of tags) {
        if (keys.match(new RegExp(escapeRegExp(tag))) !== null) {
            result = true;
        }
    }
    return result;
}

var checkTry = function (keys) {
    let isTry = false;
    if (debug) console.log('keys:', keys.split(' '));
    for (let key of keys.split(' ')) {
        let lowerCaseKey = key.toLowerCase();
        if (debug) console.log('key:', lowerCaseKey);
        if (charList[lowerCaseKey] !== undefined) {
            isTry = lowerCaseKey;
        }
    }
    return isTry;
}

var escapeRegExp = function (text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        init();
    }
}