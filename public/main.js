//const update = document.querySelector('.update-button')
function updateItem(event){
    var rowId = event.target.parentNode.parentNode.id;
    var data = document.getElementById(rowId).querySelectorAll(".row-data"); 
    var name = data[0].innerHTML;
    var mobile = data[1].innerHTML;
    //alert("Name: " + name + "\nMobile: " + mobile);

    fetch('/updateEmployee', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            mobile: mobile
         })
    })
}

function deletItem(event){
    var rowId = event.target.parentNode.parentNode.id;
    var data = document.getElementById(rowId).querySelectorAll(".row-data"); 
    var name = data[0].innerHTML;
    var mobile = data[1].innerHTML;
    fetch('/deleteEmployee', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: name,
            mobile: mobile
         })
    })
}