var dataBase = firebase.database();

function trainChanges() {
    dataBase.ref('trains').on('value', function (snapShot) {
        getKeys(snapShot.val());
        console.log(snapShot.val());
    })
}

function getKeys(object) {
    var keysArray = (Object.keys(object));
    var string = '';
    for (let i = 0; i < keysArray.length; i++) {
        var key = keysArray[i]
        string+='<tr>'
        for (var property in object[key]) {
            string+='<td>' + object[key][property] + '</td>';
        }
        string+='</tr>'
    }

    console.log(string);
}

function htmlString (){

}



function postTrainInfo() {
    event.preventDefault();
    var data = {};
    var inputArray = ($(this).parent().find('input'));
    for (let i = 0; i < inputArray.length; i++) {
        // console.log(inputArray[i].value);      
        var key = $(inputArray).eq(i).attr('id')
        var val = inputArray[i].value;
        data[key] = val;
    }
    //  console.log(data);
    dataBase.ref('trains').push().set(data);
    inputArray.val('');
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

function saveTrain() {

}


$('#submitBtn').on('click', postTrainInfo);

$('tbody').on('click', '.remove', removeTrain)

$('tbody').on('click', '.update', updateTrain)

$('tbody').on('click', '.save', saveTrain)


// dataBase.ref('trains').push().set({
//     name:'1234'
// });

trainChanges();