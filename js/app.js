var dataBase = firebase.database();
// var buttons = $('.buttons')[0].outerHTML;

function trainChanges() {
    dataBase.ref('trains').on('value', function (snapShot) {
        sync()
        getKeys(snapShot.val());
         
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

function minutesAway() {
    console.log($('td[data-name=firstTrainTime]'))
    console.log(moment().format("hh:mm:ss a"));

}

function postTrainInfo(event) {
    event.preventDefault();
    var data = {};
    var timeNow = moment();
    var inputArray = ($(this).parent().find('input'));
    for (let i = 0; i < inputArray.length; i++) {
        // console.log(inputArray[i].value);      
        var key = $(inputArray).eq(i).attr('id')
        var val = inputArray[i].value;
        data[key] = val;
    }
    var hhmm = convertString(data.firstTrainTime);
    data.firstTrainTime = moment(hhmm).format();
    data.minutesAway = moment(data.firstTrainTime).diff(timeNow, 'minutes');
    dataBase.ref('trains').push().set(data);
    inputArray.val('');

}




function convertString(string) {
    var timeArray = string.split(':')
    for (var i = 0; i < timeArray.length; i++)
        timeArray[i] = parseInt(timeArray[i]);
    return {
        hours: timeArray[0],
        minutes: timeArray[1]
    }

}



function removeTrain() {
    $(this).parent().parent().remove();
}

function updateTrain() {
    var tdArray = $(this).parent().parent().find('td').not('.buttons');
    for (let i = 0; i < tdArray.length; i++) {
        var currentValue = $(tdArray).eq(i).text();
        $(tdArray).eq(i).html('<input type=text>').find('input').val(currentValue);
        $('.update').text('Save').addClass('save').remove('update');
        //    console.log(currentValue);
    }
}

function sync(){
var currentTime = moment();



}

trainChanges();


$('#submitBtn').on('click', postTrainInfo);