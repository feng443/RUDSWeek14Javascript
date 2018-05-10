/*


TODO:
1) Add reset button for filters and data
2) Speed up performance by search within sub set



*/

var PAGE_NUMBER = 0;
var COLUMNS = [ 'datetime', 'city', 'state', 'country', 'shape', 'durationMinutes', 'comments', ];
var OPTION_COLUMNS = [ 'city', 'state', 'country', 'shape', ];

// Comment out after testing
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
    console.log('search called');
    var optionValues = {};
    OPTION_COLUMNS.concat(['datetime']).forEach( col => {
        // console.log('gather valuess: ' + col);
        var value = document.getElementById(col).value;
        // console.log('found: ' + value);
        if ( value != '')
            optionValues[col] = value;
    });

    // if (Object.keys(optionValues).length === 0 ) {
    //    return;
    //}

    var dataSubSet = [];
    DATA_SET.forEach( item => {
       if (matchItem(item, optionValues))
            dataSubSet.push(item);
    })
    fillDataTable(dataSubSet);
}
