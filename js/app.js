var dataBase = firebase.database();

function trainChanges() {
    dataBase.ref().on('value', function (snapShot) {
        sync(snapShot.val().trains)
    })
}


function getKeys(object) {
    var keysArray = (Object.keys(object));
    $('tbody').empty();
    for (var i = 0; i < keysArray.length; i++) {
        var key = keysArray[i]
        var string = `<tr data-id=${key}>`;
        for (var property in object[key]) {
            if (property === 'firstTrainTime') {
                var timeString = object[key][property];
                object[key][property] = moment(timeString).format('hh:mm a');
            }
            string += `<td data-name=${property}>${object[key][property]}</td>`;
        }
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
    for (var i = 0; i < inputArray.length; i++) {
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
    dataBase.ref('trains').push().set(data);
}

function convertString(string) {
    var timeArray = string.split(':')
    for (var i = 0; i < timeArray.length; i++) {
        timeArray[i] = parseInt(timeArray[i]);
    }
    return {
        hour: timeArray[0],
        minute: timeArray[1]
    }
}

function sync(object) {
    var timeNow = moment();
    var trains = Object.keys(object);
    for (var i = 0; i < trains.length; i++) {
        var someTime = object[trains[i]].firstTrainTime;
        while (moment(someTime).diff(timeNow, 'seconds') < 0) {
            var frequency = parseInt(object[trains[i]].frequency)
            someTime = moment(someTime).add(frequency, 'minutes').format();
        }
        object[trains[i]].firstTrainTime = someTime;
        object[trains[i]].minutesAway = moment(someTime).diff(timeNow, 'minutes');
        dataBase.ref(`trains/${trains[i]}`).set(object[trains[i]])
    }
    getKeys(object);
}

trainChanges();
setInterval(function updateOnTheFly() {
    dataBase.ref('timer').set(Math.random())
}, 20000)


$('#submitBtn').on('click', postTrainInfo);