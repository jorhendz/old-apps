let report;
let page = 1;

$(document).ready(function () {
    initPanzoom();
    initCalendar();
    onHover();
    createPageButtons(0);
    $('input[name="daterange"]').daterangepicker({
        timePicker: true,
        timePicker24Hour: true,
        maxDate: '12/30/2015',
        locale: {
            format: 'DD/MM/YYYY H:mm'
        }
    });

    $(".btn-report").click((e) => {
        $('.btn-report').removeClass('active').addClass('inactive');
        const id = e.target.id;
        activateButton($(`#${id}`))
        page = 1;
    });
    $("#btn-events").click(() => {
        createPageButtons('event_count');
        updateDashboard('event_count');
        activateButton($(this));
        resetMap();
    });
    $("#btn-social-workers").click(function () {
        createPageButtons('social_workers');
        updateDashboard('social_workers');
        activateButton($(this));
        resetMap();
    });
});

function activateButton(button) {
    button.removeClass('inactive').addClass('active');
}

function updateDashboard(reportName) {
    report = reportName;
    const dataPath = reportToUrl(report);
    updateMap(dataPath);
    updateTable(report, page);
}

function reportToUrl(reportName) {
    return `/analytics/country_map/metrics/${reportName}/`;
}

function resetMap() {
    const municipalities = $(`g .kommune`);
    municipalities.each((i, muni) => {
        try {
            muni.style.fill = 'var(--bg-muni)';
        } catch (e) {
            if (e instanceof TypeError) {
                console.log("[WARNING] TypeError for in resetMap " + muni);
            }
            console.log(e);
        }
    });
}

async function fetchJson(url) {
    let res = await fetch(url);
    let data = await res.json();
    return data;
}

async function fetchNumber(url) {
    let res = await fetch(url);
    let text = await res.text();
    let _number = parseInt(text);
    return _number;
}

function updateTitle(newTitle) {
    $("#title").html(newTitle);
    $("#table-metric").html(newTitle);
}

function updateMap(url) {
    setLoaderVisible(true);

    fetchJson(url).then((data) => {
        setLoaderVisible(false);

        const values = Object.values(data);
        const min = Math.min(...values);
        const max = Math.max(...values);
        for (const muni in data) {
            let municipality;
            const value = data[muni];
            try {
                municipality = document.querySelector(`g [data-name="${muni}"]`);
                municipality.setAttribute("data-metric", value);
            } catch (e) {
                continue;
            }

            try {
                const color = valToColor(value, min, max);
                municipality.style.fill = color;
            } catch (e) {
                handleFetchError(e);
            }
        }
        // Show the info panel
        const infoPanel = document.getElementById("info-panel");
        infoPanel.style.visibility = "visible";
    });
}

function verboseName(reportName) {
    switch (reportName) {
        case "event_count": return "Events i alt";
        case "social_workers": return 'Antal socialrådgivere';
    }
}

function updateTable(reportName, _page) {
    page = _page;
    const url = `${reportToUrl(reportName)}page/${page}/`;
    fetchJson(url).then((data) => {
        const table = $("#table-rows");
        table.html("");
        for (const muni in data) {
            const value = data[muni];
            const row = tableRow(muni, value);
            table.append(row);
        }
        updateTitle(verboseName(reportName));
    });
}

function createPageButtons(reportName) {
    if (!reportName) return;

    const url = `/analytics/country_map/metrics/${reportName}/num_pages/`;
    let numPages;
    const container = $("#page-buttons");
    container.html("");
    fetchNumber(url).then((nPages) => {
        numPages = nPages;
        for (let i = 1; i < numPages + 1; i++) {
            const button = createPageButton(i);
            container.append(button);
        }
        activatePageButton(1);
    }).catch((e) => {
        handleFetchError(e);
    });
}

function createPageButton(pageNum) {
    const button = $($.parseHTML(`<button id="${pageNum}" class="btn-page">${pageNum}</button>`))
    button.click((e) => {
        page = parseInt(e.target.id);
        updateTable(report, page);
        activatePageButton(pageNum);
    });
    return button;
}

function activatePageButton(pageNum) {
    $('.btn-page').removeClass('active').addClass('inactive');
    $(`#${pageNum}`).removeClass('inactive').addClass('active');
}

function tableRow(dimension, metric) {
    return `<tr><th>${dimension}</th><th>${metric}</th></tr>`

}

function handleFetchError(e) {
    if (e instanceof TypeError) {
        console.log("[WARNING] TypeError for " + muni);
        return;
    }
    console.log(e);
}

function getContent(url) {
    setLoaderVisible(true);

    const Http = new XMLHttpRequest();
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
        setDynamicStyle(Http.responseText);
        setLoaderVisible(false);
    }
}

function setDynamicStyle(css) {
    const style_tag = document.getElementById("dynamic-style");
    style_tag.innerHTML = css;
}

function setLoaderVisible(visible) {
    const loader = document.getElementById("loader");
    if (visible === true) {
        loader.style.visibility = "visible";
        return
    }
    loader.style.visibility = "hidden";
}

/** 
* The the appropriate color based on the input value and the range [min_val; max_val].
* @summary Our color scheme is a linear gradient from one brand color to another.
* @return {String} The color as a css value, e.g. "hsl(169, 42.0%, 72.0%)"
*/
function valToColor(val, min_val, max_val) {
    hue = 169;
    saturation = translateToRange(val, min_val, max_val, 42, 18);
    lightness = translateToRange(val, min_val, max_val, 72, 35);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/** 
* Translate a value from one range to another.
* @summary This function assumes old_min < value < old_max.
* @return {Number} new_min < result < new_max
*/
function translateToRange(value, old_min, old_max, new_min, new_max) {
    old_range = old_max - old_min
    new_range = new_max - new_min
    value_scaled = parseFloat(value - old_min) / parseFloat(old_range)

    // A value between new_min and new_max
    return new_min + (value_scaled * new_range)
}

function initCalendar() {
    var start = moment().subtract(29, 'days');
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('D. MMM YYYY') + ' - ' + end.format('D. MMM YYYY'));
        console.log("A new date selection was made: " + start.format('D. MMM YYYY') + ' - ' + end.format('D. MMM YYYY'));
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            'I dag': [moment(), moment()],
            'Sidste 7 dage': [moment().subtract(6, 'days'), moment()],
            'Sidste 30 dage': [moment().subtract(29, 'days'), moment()],
            'Denne måned': [moment().startOf('month'), moment().endOf('month')],
            'Sidste 3 måneder': [moment().subtract(3, 'month'), moment()],
        },
        timePicker: true,
        timePicker24Hour: true,
        maxDate: '12/30/2015',
        locale: {
            format: 'DD/MM/YYYY H:mm'
        }
    }, cb);

    cb(start, end);
}

function initPanzoom() {
    // https://github.com/timmywil/panzoom
    const elem = document.getElementById('panzoom-element');
    const button = document.getElementById('btn');
    const panzoom = Panzoom(elem, {
        minScale: 1,
        contain: "outside"
    });
    // Panning and pinch zooming are bound automatically (unless disablePan is true).
    // There are several available methods for zooming
    // that can be bound on button clicks or mousewheel.
    elem.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
}

let colorBeforeHover;

function onHover() {
    $(".kommune").mouseenter(function () {
        colorBeforeHover = $(this).css("fill");
        $(this).css({ "fill": "var(--almost-white)" });
        updateInfoBox(this);
    });

    $(".kommune").mouseleave(function () {
        $(this).css({ "fill": `${colorBeforeHover}` });
    });
}

function updateInfoBox(hoveredElement) {
    const name = $(hoveredElement).attr("data-name");
    const metric = $(hoveredElement).attr("data-metric");
    $("#info-dimension").text(name);
    $("#info-metric").text(objectOrZero(metric));
}

function objectOrZero(obj) {
    if (typeof obj === 'undefined') return 0;
    return obj;
}