var modal = document.getElementById("create-dashboard-modal");
var createbtn = document.getElementById("create-dashboard");
var closebtn = document.getElementById("closebtn");
var submitbtn = document.getElementById("submitbtn");
closebtn.onclick = function(){
    modal.style.display = "none";
    console.log("modal closed");
}
createbtn.onclick = function(){
    modal.style.display = "block";
    console.log("modal opened");
}
submitbtn.onclick = function(event){
    event.preventDefault()
    window.location.href = "http://127.0.0.1:5501/Dashboard/dashboardBuilder.html";
}

