const nullSearch = {
    'service_category': [], 
    'region': [],
    'free': null,
    'internal': null,
    'online': null,
    'sex': null,
    'themes': []
}

const SERVICE_CATEGORY = "serviceCategory";
const REGION = "region";
const IS_FREE = "isFree";
const IS_INTERNAL = "isInternal";
const IS_ONLINE = "isOnline";
const IS_MALE = "isMale";
const THEME = "theme";
const WAITING_TIME_CHOICE = "waitingTimeChoice";
const LANGUAGE = "language";

let parameters = nullSearch;

let badges = [];

function resetSearch() {
    badges = [];
    drawBadges();
}

function setServiceCategory(serviceCategory, text) {
    pushBadge([SERVICE_CATEGORY, serviceCategory, text]);
}

function setRegion(region, text) {
    pushBadge([REGION, region, text]);
}

function setFree(isFree, text) {
    pushBadge([IS_FREE, isFree, text]);
}

function setInternal(isInternal, text) {
    pushBadge([IS_INTERNAL, isInternal, text]);
}

function setOnline(isOnline, text) {
    pushBadge([IS_ONLINE, isOnline, text]);
}

function setSex(isMale, text) {
    pushBadge([IS_MALE, isMale, text]);
}

function setTheme(theme, text) {
    pushBadge([THEME, theme, text]);
}

function setWaitingTimeChoice(waitingTimeChoice, text) {
    pushBadge([WAITING_TIME_CHOICE, waitingTimeChoice, text]);
}

function setLanguage(language, text) {
    pushBadge([LANGUAGE, language, text]);
}

function pushBadge(badge) {
    // Todo: for checkboxes, only push a badge if the checkbox is checked
    if (!badgeAlreadyExists(badge)) {
        badges.push(badge);
        drawBadges();
    }
}

function badgeAlreadyExists(badge) {
    for (i = 0; i < badges.length; i++) {
        text = badges[i][2];
        if (badge[2] === text) {
            return true;
        }
    }
    return false;
}

const containingDivId = "chosenItemsDiv";

function deleteBadge(index) {
    if (index > -1) {
        badges.splice(index, 1);
    }
    drawBadges();
}

function drawBadges() {
    deleteDrawnBadges();
    containingDiv = document.getElementById(containingDivId);
    for (i = 0; i < badges.length; i++) {
        const text = badges[i][2];
        containingDiv.appendChild(createBadgeMarkup(text, i));
    }
}

function deleteDrawnBadges() {
    const containingDiv = document.getElementById(containingDivId);
    containingDiv.innerHTML = "";
}

function createBadgeMarkup(text, i) {
    const badgeMarkup = elementFactory(
        'div',
        {
            class: 'badge bg-info',
            style: "margin: 0.25em",
            index: i 
        },
        elementFactory(
            'span',
            {},
            text,
        ),
        elementFactory(
            'button',
            { 
                type: 'button',
                class: 'btn-close',
                onclick: "deleteBadge(" + i + ")",
                index: i 
            },
            ""
        )
    );
    return badgeMarkup;
}

const elementFactory = (type, attributes, ...children) => {
  const element = document.createElement(type);
  for (key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
  children.forEach(child => {
    if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
    } else {
        element.appendChild(child);
    }
  });

  return element;
}

function buildSearchURL() {
    // In HTML, the get URL is structured with 'name'-attributes as the keys
    // and 'value' attributes as the value.
    // Hacky workaround ensues.
    getValuesForName("theme[]");
}

function getValuesForName(className) {
    var values = document.getElementsByClassName(className);
    console.log(values);
    return values;
}
