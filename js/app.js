var dataBase = firebase.database();
// var buttons = $('.buttons')[0].outerHTML;

function trainChanges() {
    dataBase.ref('trains').on('value', function (snapShot) {
        sync(snapShot.val())
    })
}


function getKeys(object) {
    var keysArray = (Object.keys(object));
    $('tbody').empty();
    for (let i = 0; i < keysArray.length; i++) {
        var key = keysArray[i]
        var string = `<tr data-id=${key}>`;
        for (var property in object[key]) {
            if (property === 'firstTrainTime') {
                var timeString = object[key][property];
                object[key][property] = moment(timeString).format('hh:mm a');
            }
            string += `<td data-name=${property}>${object[key][property]}</td>`;
        }
        // string += buttons;
        string += '</tr>'
        var freq = $(string).find('td[data-name=frequency]')[0].outerHTML;
        var timeCol = $(string).find('td[data-name=firstTrainTime]')[0].outerHTML;
        $('tbody').append(string);
        $(`tr[data-id=${key}]`).prepend($(`tr[data-id=${key}]`).find('td[data-name=train]'))
        $(`tr[data-id=${key}]`).find('td').eq(3).replaceWith(timeCol);
        $(`tr[data-id=${key}]`).find('td').eq(2).replaceWith(freq);

    }


}

 
function postTrainInfo(event) {
    event.preventDefault();
    var data = {};
    var inputArray = ($(this).parent().find('input'));
    for (let i = 0; i < inputArray.length; i++) {
        // console.log(inputArray[i].value);      
        var key = $(inputArray).eq(i).attr('id')
        var val = inputArray[i].value;
        data[key] = val;
    }

    convert(data);
    inputArray.val('');
}


function convert(data) {
    var hhmm = convertString(data.firstTrainTime);
    var timeNow = moment();
    data.firstTrainTime = moment(hhmm).format();
    data.minutesAway = moment(data.firstTrainTime).diff(timeNow, 'minutes');
    console.log(data);
    dataBase.ref('trains').push().set(data);


}

function convertString(string) {
    var timeArray = string.split(':')
    for (var i = 0; i < timeArray.length; i++){
        timeArray[i] = parseInt(timeArray[i]);
    }
    return {
        hour: timeArray[0],
        minute: timeArray[1]
    }
}

function sync(object) {
    let timeNow = moment();
    var trains = Object.keys(object);
    for (let i = 0; i < trains.length; i++) {
        let someTime = object[trains[i]].firstTrainTime;
        console.log(someTime);
        while (moment(someTime).diff(timeNow, "seconds") < 0) {
            let frequency = parseInt(object[trains[i]].frequency)
            console.log(frequency);
            someTime = moment(someTime).add(frequency, 'minutes').format();
        }
        object[trains[i]].firstTrainTime = someTime;
        object[trains[i]].minutesAway = moment(someTime).diff(timeNow, "minutes");
        dataBase.ref(`trains/${trains[i]}`).set(object[trains[i]])
    }
    getKeys(object);
}
trainChanges();


$('#submitBtn').on('click', postTrainInfo);