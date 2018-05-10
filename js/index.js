/*

<Chan Feng> 2018-05-10 Rutgers Data Science Bootcamp Assignement 14, JavaScript and DOM Manipulation

TODO:
1) Progress bar
2) Reset filter
3) Option for 'relevent' only filter
4) Date Picker
5) CSS table alternative colors, borders

*/

var PAGE_NUMBER = 0;
var COLUMNS = [ 'datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments', ];
var OPTION_COLUMNS = [ 'city', 'state', 'country', 'shape', 'durationMinutes'];

// Comment out after testing
DATA_SET = dataSet;
DATA_SET = dataSet.slice(1, 100);
document.getElementById('submit').addEventListener('click', search);

function renderBody(dataSubSet) {
    fillSearchForm(dataSubSet);
    fillDataTable(dataSubSet);
}

// Loop through all option COLUMNS and fill in unique values
function fillSearchForm(dataSubSet){
    var valueSets = {};
    OPTION_COLUMNS.forEach( col => valueSets[col] = new Set(['']) );
    dataSubSet.forEach( data => OPTION_COLUMNS.forEach( col => valueSets[col].add(data[col]) ) );
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

// Use dataSubSet so this function can be more generic
function fillDataTable(dataSubSet) {
    var dataTable = document.getElementById('data_table');

    // Clear everything except header
    for (i = dataTable.rows.length - 1; i > 1; i-- )  // Has to do backward since row # changes
        dataTable.deleteRow(i);

    // Fill in rows
    dataSubSet.forEach( data => {
        var row = dataTable.insertRow();
        COLUMNS.forEach( item => {
            var cell = row.insertCell();
            cell.innerText = data[item];
         });
    });
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

    var dataSubSet = [];
    DATA_SET.forEach( item => {
       if (matchItem(item, optionValues))
            dataSubSet.push(item);
    })
    fillDataTable(dataSubSet);
}
