/*

<Chan Feng> 2018-05-10 Rutgers Data Science Bootcamp Assignement 14, JavaScript and DOM Manipulation

*/

var PAGE_NUMBER = 1;
var PAGE_SIZE = 10;
var PAGE_CONTROL_SIZE = 5;

const COLUMNS = [ 'datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments', ];
const OPTION_COLUMNS = [ 'city', 'state', 'country', 'shape', 'durationMinutes'];

// Comment out after testing
DATA_SET = dataSet;
console.log(DATA_SET.length);
// DATA_SET = dataSet.slice(1, 21);
DATA_SUBSET = DATA_SET.slice();
document.getElementById('submit').addEventListener('click', search);

function renderBody() {
    fillSearchForm();
    fillDataTable();
    fillPagination();
}

// Loop through all option COLUMNS and fill in unique values
function fillSearchForm(){
    var valueSets = {};
    OPTION_COLUMNS.forEach( col => valueSets[col] = new Set(['']) );
    DATA_SET.forEach( data => OPTION_COLUMNS.forEach( col => valueSets[col].add(data[col]) ) );
    for (var key in valueSets) {
        Array.from(valueSets[key]).sort().forEach( value => {
            var x = document.createElement("option");
            x.setAttribute('value', value);
            var t = document.createTextNode(value);
            x.appendChild(t);
            document.getElementById(key).appendChild(x);
        });
     };
}

function fillDataTable() {
    var dataTable = document.getElementById('data-table-body');

    // Clear everything except header
    for (i = dataTable.rows.length - 1; i >= 0; i-- )  // Has to do backward since row # changes
        dataTable.deleteRow(i);

    // Fill in current page
    var page_start = (PAGE_NUMBER - 1) * PAGE_SIZE;
    var page_end = page_start + PAGE_SIZE;
    if (page_end > DATA_SUBSET.length ) {
        page_end = DATA_SUBSET.length;
    }
    console.log('page_start: ' + page_start);
    console.log('page_end: ' + page_end);

    for (i = page_start; i < page_end; i++) {
        data = DATA_SUBSET[i];
        var row = dataTable.insertRow();
        COLUMNS.forEach( item => {
            var cell = row.insertCell();
            cell.innerText = data[item];
         });
    }

    document.getElementById('page_start').innerText = page_start + 1;
    document.getElementById('page_end').innerText = page_end + 1;
    document.getElementById('max_number').innerText = DATA_SUBSET.length;
}

// Assumption: only non empty values are passed in
function matchItem(item, optionValues) {
    for (var col in optionValues) {
        if (item[col] != optionValues[col])
            return false; // short-circuit
    }
    return true; // All pass
}

/* If input is empty ignore, otherwise look for match */
function search(event) {
    event.preventDefault();
    var optionValues = {};

    OPTION_COLUMNS.concat(['datetime']).forEach( col => {
        var value = document.getElementById(col).value;
        if ( value != '')
            optionValues[col] = value;
    });

    DATA_SUBSET = [];
    DATA_SUBSET = DATA_SET.filter( item => matchItem(item, optionValues) );
    fillDataTable();
    fillPagination();
}

function turnPage(event) {
    var page = this.firstChild.innerText;
    if (page === 'Previous' )
        PAGE_NUMBER -= 1;
    else if (page === 'Next' )
        PAGE_NUMBER += 1;
    else
        PAGE_NUMBER = Number(page);

    fillDataTable();
    fillPagination();
}

function addNavPage(ul, page) {
    var a = document.createElement('a');
    a.appendChild(document.createTextNode(page));
    a.setAttribute('class', 'page-link');
    a.setAttribute('href', '#');

    var li = document.createElement('li');
    li.setAttribute('class', 'page-item');

    console.log('PAGE_NUMBER: ' + PAGE_NUMBER);
    console.log('maxPageNumber: ' + maxPageNumber());
    console.log('page: ' + page);
    var disabled = false;
    if (page == 'Next' && PAGE_NUMBER >= maxPageNumber() ||
        page == 'Previous' && PAGE_NUMBER == 1 ||
        page == '...') {
        li.setAttribute('class', 'page-item disabled');
        disabled = true;
    }
    if ( page == PAGE_NUMBER.toString()){
        console.log('set active: '+ page);
        li.setAttribute('class', 'page-item active');
    }
    li.appendChild(a);

    if (!disabled)
        li.addEventListener('click', turnPage);
    ul.appendChild(li);
}

function maxPageNumber() {
    return Math.ceil(DATA_SUBSET.length / PAGE_SIZE);
}

function getPagesInMiddle() {
    maxNum = maxPageNumber();
    curNum = PAGE_NUMBER;
    ctlNum = PAGE_CONTROL_SIZE;

    if (maxNum <= ctlNum) {
        return Array.from(new Array(maxNum), (v, i) => i + 1);
    } else if (curNum <= ctlNum )
        return Array.from(new Array(ctlNum + 1), (v, i) => i + 1).concat(['...', maxNum]);
    else if (curNum > maxNum - ctlNum )
        return [1, '...'].concat(
            Array.from(new Array(ctlNum), (v, i) => curNum - ctlNum + i) //
           // [ maxNum - 4, maxNum - 3, maxNum - 2, maxNum - 1]
        ).concat([maxNum]);
    else
        return [1, '...',  curNum - 2, curNum - 1, curNum, curNum + 1, curNum + 2, '...', maxNum];
}

function fillPagination() {
    var ul = document.getElementById('data-pagination');
    while( ul.firstChild ){
        ul.removeChild(ul.firstChild);
    }

    // Always show first and last page
    addNavPage(ul,  'Previous');
    getPagesInMiddle().forEach(page => addNavPage(ul, page));
    addNavPage(ul, 'Next');
}
