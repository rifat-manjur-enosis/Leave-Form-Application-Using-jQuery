let allRequests = [];
let allRequestIndex = 0;
let uniqueId = 1;
let updateFlag = false;
let updateIndex = 0;
let updateId = 0;

function goToFormPage(){
    $("#formPage").show();
    $("#listPage").hide();
}

function goToListPage(){   
    clearForm();
    $("#formPage").hide();
    $("#listPage").show();
}

function clearForm(){
    $('#name').val('');
    $('#fromDate').val('');
    $('#toDate').val('');
    $('#reason').val('');
    $('input[name="type"]').prop('checked', false);
    $('#attachment').val('');
    $('#contact').val('');
    $("#imgShow").empty();
    hideRow("#nameRequired");
    hideRow("#dateRequired");
    hideRow("#typeRequired");
    hideRow("#reasonRequired");
    hideRow("#contactRequired");
    hideRow("#pathRequired");
}

function createNewLeave(){
    clearForm();
    goToFormPage();
}

function getPathToImage(path){
    let img = new Image();
    let url = path.substring(12,path.length);
    img.src = url;
    return img;
}

function showListTableContent(allRequests){   
    $("#listTableBody").empty();
    for(let i=0;i<allRequests.length;i++){   
        let newRow = '<tr>';
        newRow += '<td>' + allRequests[i].id + '</td>';
        newRow += '<td>' + allRequests[i].name + '</td>';
        newRow += '<td>' + allRequests[i].leaveType + '</td>';
        newRow += '<td>' + allRequests[i].leaveCount + '</td>';
        newRow += '<td>' + allRequests[i].reason + '</td>';
        newRow += '<td>' + allRequests[i].contact + '</td>';
        newRow += '</tr>';
        $('#listTableBody').append(newRow);
        let img = getPathToImage(allRequests[i].imagePath);
        $('#listTableBody tr:last').append(img);
        let editDeleteButtont = '<input type="button" value="Update" onclick="updateRecord(this)"/> <input type="button" value="Delete" onclick="deleteRecord(this)"/>';
        $('#listTableBody tr:last').append('<td>'+editDeleteButtont+'</td>');
    }
    goToListPage();
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
    let _name = $("#name").val();
    let _fromDate = $("#fromDate").val();
    let _toDate = $("#toDate").val();
    let _leaveCount = getLeaveCount(_fromDate,_toDate);
    let _leaveType = $("input[name='type']:checked").val();
    let _reason = $("#reason").val();
    let _contact = $("#contact").val();
    let _imagePath = $("#attachment").val();
    if(_imagePath==="" && updateFlag == true && $("#imgShow").html())
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

function showRow(id){
    $(id).css("visibility", "visible");
}

function hideRow(id){
    $(id).css("visibility", "collapse");
}

function isValid(name, from, to, count,type,reason,contact,path){   
    let valid = true;
    if(name===""){
        showRow("#nameRequired");
        valid = false;
    }
    else
        hideRow("#nameRequired");
    if(from==="") {
        showRow("#dateRequired");
        valid = false;
    }
    else if(to===""){
        showRow("#dateRequired");
        valid = false;
    }
    else if(new Date(to) <= new Date(from) ) {
        showRow("#dateRequired");
        valid = false;
    }
    else 
        hideRow("#dateRequired");
    if(typeof(type) ==='undefined') {
        showRow("#typeRequired");
        valid = false;
    }
    else
        hideRow("#typeRequired");
    if(reason==="") {
        showRow("#reasonRequired");
        valid = false;
    }
    else
        hideRow("#reasonRequired");
    if(contact==="") {
        showRow("#contactRequired");
        valid = false;
    }
    else
        hideRow("#contactRequired");
    if( path==="" ) {
        showRow("#pathRequired");
        valid = false;
    }
    else
        hideRow("#pathRequired");
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
    if (confirm('Are you sure you want to delete this record?')){
        selectedRow = $(td).closest("tr");
        let selectedId = selectedRow.find('td:eq(0)').text();
        let index = getIndexFromId(selectedId);
        allRequests.splice(index, 1);
        allRequestIndex--;
        showListTableContent(allRequests);
    }
}

function getIndexFromId(selectedId){   
    let index = 0;
    for(let i=0;i<allRequests.length;i++){   
        if(allRequests[i].id == selectedId){   
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
        $("input[name='type'][value='Casual']").prop('checked', true);   
    }
    else{
        $("input[name='type'][value='Sick']").prop('checked', true);   
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
    let inputName = $("#searchText").val().toLowerCase();
    let index = 0;
    let copyRequests = [];
    for(let i=0;i<allRequests.length;i++){
        let name = allRequests[i].name.toLowerCase();
        if(name.match(inputName)!=null){
            copyRequests[index] = allRequests[i];
            index++;
        }
    }
    showListTableContent(copyRequests);
}

function previewImage(){
    let path = $("#attachment").val();
    let img = getPathToImage(path)
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