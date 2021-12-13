let allRequests = [];
let allRequestIndex = 0;
let uniqueId = 1;
let updateFlag = false;
let updateIndex = 0;
let updateId = 0;

function showDiv(text){
    document.getElementById(text).style.display = "block";
}

function hideDiv(text){
    document.getElementById(text).style.display = "none";
}

function goToFormPage(){
    showDiv("formPage");
    hideDiv("listPage");
}

function goToListPage(){   
    clearForm();
    showDiv("listPage");
    hideDiv("formPage");
}

function clearForm(){
    document.getElementById('name').value = '';
    document.getElementById('fromDate').value = '';
    document.getElementById('toDate').value = '';
    document.getElementById('reason').value = '';
    document.getElementById('casual').checked= false;
    document.getElementById('sick').checked = false;
    document.getElementById('attachment').value = '';
    document.getElementById('contact').value = '';
    document.getElementById("imgShow").innerHTML = "";
    hideRow("nameRequired");
    hideRow("dateRequired");
    hideRow("typeRequired");
    hideRow("reasonRequired");
    hideRow("contactRequired");
    hideRow("pathRequired");
}

function createNewLeave(){
    clearForm();
    goToFormPage();
}

function getPathToImage(path){
    let img = document.createElement('img'); 
    img.src = path.substring(12,path.length);
    return img;
}

function showListTableContent(allRequests){   
    let rowCount = listTable.rows.length;
    for (let i=rowCount-1;i>0;i--)
        listTable.deleteRow(i);
    for(let i=0;i<allRequests.length;i++){   
        let newRow = document.getElementById('listTable').insertRow(i+1);
        newRow.insertCell(0).innerHTML = allRequests[i]["id"];
        newRow.insertCell(1).innerHTML = allRequests[i]["name"];
        newRow.insertCell(2).innerHTML = allRequests[i]["leaveType"];
        newRow.insertCell(3).innerHTML = allRequests[i]["leaveCount"];
        newRow.insertCell(4).innerHTML = allRequests[i]["reason"];
        newRow.insertCell(5).innerHTML = allRequests[i]["contact"];
        let img = getPathToImage(allRequests[i]["imagePath"]);
        newRow.insertCell(6).appendChild(img);
        newRow.insertCell(7).innerHTML = '<input type="button" value="Update" onclick="updateRecord(this)"/> <input type="button" value="Delete" onclick="deleteRecord(this)"/>';
    }
    goToListPage();
}

function getCheckedLeaveType(){   
    let leaveTypes = document.getElementsByName('type');
    let checkedLeaveType = "";
    for(let i=0;i<leaveTypes.length;i++){
        if(leaveTypes[i].checked){
            checkedLeaveType = leaveTypes[i].value;
            break;
        }
    }
    return checkedLeaveType;
}

function getLeaveCount(date1, date2){   
    let leaveCount = new Date(date2).getTime() - new Date(date1).getTime();
    leaveCount = leaveCount/(1000 * 3600 * 24);
    return leaveCount;
}

function insertRecord(){   
    let _id = 0;
    if(updateFlag)
        _id = updateId;
    else
        _id = uniqueId;
    let _name = document.getElementById("name").value;
    let _fromDate = document.getElementById("fromDate").value;
    let _toDate = document.getElementById("toDate").value;
    let _leaveCount = getLeaveCount(_fromDate,_toDate);
    let _leaveType = getCheckedLeaveType();
    let _reason = document.getElementById("reason").value;
    let _contact = document.getElementById("contact").value;
    let _imagePath = document.getElementById("attachment").value;
    if(_imagePath==="" && updateFlag == true && document.getElementById("imgShow").innerHTML != "")
        _imagePath = allRequests[updateIndex].imagePath;
    if(isValid(_name, _fromDate,_toDate,_leaveCount,_leaveType,_reason,_contact,_imagePath)){   
        const singleRequest = {   
            id: _id,
            name: _name,
            leaveType: _leaveType,
            leaveCount: _leaveCount,
            reason: _reason,
            contact: _contact,
            imagePath: _imagePath,
            fromDate: _fromDate,
            toDate: _toDate
        };
        if(updateFlag){   
            allRequests[updateIndex] = singleRequest;
            updateFlag = false;
        }
        else{
            allRequests[allRequestIndex] = singleRequest;
            allRequestIndex++;
            uniqueId++;
        }
        showListTableContent(allRequests);
    }
}

function showRow(text){
    document.getElementById(text).style.visibility = "visible";
}

function hideRow(text){
    document.getElementById(text).style.visibility = "collapse";
}

function isValid(name, from, to, count,type,reason,contact,path){   
    let valid = true;
    if(name===""){
        showRow("nameRequired");
        valid = false;
    }
    else
        hideRow("nameRequired");
    if(from==="") {
        showRow("dateRequired");
        valid = false;
    }
    else if(to===""){
        showRow("dateRequired");
        valid = false;
    }
    else if(new Date(to) <= new Date(from) ) {
        showRow("dateRequired");
        valid = false;
    }
    else 
        hideRow("dateRequired");
    if(type==="") {
        showRow("typeRequired");
        valid = false;
    }
    else
        hideRow("typeRequired");
    if(reason==="") {
        showRow("reasonRequired");
        valid = false;
    }
    else
        hideRow("reasonRequired");
    if(contact==="") {
        showRow("contactRequired");
        valid = false;
    }
    else
        hideRow("contactRequired");
    if( path==="" ) {
        showRow("pathRequired");
        valid = false;
    }
    else
        hideRow("pathRequired");
    return valid;
}

function sortAsc(){   
    allRequests.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : -1);
    showListTableContent(allRequests);
}

function sortDsc(){   
    allRequests.sort((a, b) => (a.name.toLowerCase()< b.name.toLowerCase()) ? 1 : -1);
    showListTableContent(allRequests);
}

function sortNone(){   
    allRequests.sort((a, b) => (a.id > b.id) ? 1 : -1);
    showListTableContent(allRequests);
}

function deleteRecord(td){
    if (confirm('Are you sure to delete this record?')){
        slelectedRow = td.parentElement.parentElement;
        let selectedId = slelectedRow.cells[0].innerHTML;
        allRequests.splice(getIndexFromId(selectedId), 1);
        allRequestIndex--;
        showListTableContent(allRequests);
    }
}

function getIndexFromId(selectedId){   
    let index = 0;
    for(var i=0;i<allRequests.length;i++){   
        if(allRequests[i]["id"] == selectedId){   
           index = i;
           break;
        }
    }
    return index;
}

function updateRecord(td){
    let selectedRow = $(td).closest("tr");
    let selectedId = selectedRow.find('td:eq(0)').text();
    let index =  getIndexFromId(selectedId);
    $("#name").val(allRequests[index].name);
    if(allRequests[index].leaveType === "Casual"){
        $("#casual").prop('checked', true);
        $("#sick").prop('checked', false);
    }
    else{
        $("#casual").prop('checked', false);
        $("#sick").prop('checked', true);
    }   
    $("#reason").val(allRequests[index].reason);
    $("#contact").val(allRequests[index].contact);
    $("#toDate").val(allRequests[index].toDate);
    $("#fromDate").val(allRequests[index].fromDate);
    let img = getPathToImage(allRequests[index].imagePath);
    $("#imgShow").append(img);
    updateIndex = index;
    updateId = selectedId;        
    updateFlag = true;
    goToFormPage();
}

function search(){
    let input = $("#searchText").val();
    let filter = input.toLowerCase();
    let ix = 0;
    let copyRequests = [];
    for(let i=0;i<allRequests.length;i++){
        let str = new String(allRequests[i].name);
        str = str.toLowerCase();
        if(str.match(filter)!=null){
            copyRequests[ix] = allRequests[i];
            ix++;
        }
    }
    showListTableContent(copyRequests);
}

function previewImage(){
    let img = getPathToImage($("#attachment").val())
    $("#imgShow").empty();
    $("#imgShow").append(img);
}

$(document).ready(function(){
    $("#btnCreateNewLeave").click(createNewLeave);
    $("#btnClearForm").click(clearForm);
    $("#btnSubmitForm").click(insertRecord);
    $("#btnCancelForm").click(goToListPage);
    $("#btnAsc").click(sortAsc);
    $("#btnDsc").click(sortDsc);
    $("#btnNone").click(sortNone);
    $("#searchText").keyup(search);
    $("#attachment").change(previewImage);
});