var modal = document.getElementById("create-dashboard-modal");
var modalbg = document.getElementById('modalbg');
var createbtn = document.getElementById("create-dashboard");
var closebtn = document.getElementById("closebtn");
var form = document.getElementById("dashboard-form");
var dashboardList = document.getElementById("dashboard-list");

// Close modal
closebtn.onclick = function () {
    modal.style.display = "none";
    modalbg.style.backgroundColor = "white"

};

// Open modal
createbtn.onclick = function () {
    modal.style.display = "block";
    modalbg.style.backgroundColor = "rgba(0, 0, 0, 0.2)"
};

// Handle form submission
submitbtn.onclick = function (event) {
    event.preventDefault();

    const dashboardName = document.getElementById("dashboard-name").value;
    const dashboardDescription = document.getElementById("dashboard-description").value;
    const dashboardPath = document.getElementById("dashboard-path").value;

    // Save dashboard metadata to localStorage
    const dashboardData = {
        name: dashboardName,
        description: dashboardDescription,
        path: dashboardPath,
        widgets: [],
    };

    localStorage.setItem(`dashboard_${dashboardPath}`, JSON.stringify(dashboardData));

    
    const dashboards = JSON.parse(localStorage.getItem("dashboards")) || [];
    dashboards.push({ name: dashboardName, description: dashboardDescription, path: dashboardPath });
    localStorage.setItem("dashboards", JSON.stringify(dashboards));

    window.location.href = `/Dashboard/dashboardBuilder.html?path=${dashboardPath}`;
};

// Render available dashboards
function renderDashboards() {
    dashboardList.innerHTML = "";
    var dashboards = JSON.parse(localStorage.getItem("dashboards")) || [];

    dashboards.forEach(function (dashboard) {
        var dashboardItem = document.createElement("div");
        dashboardItem.id = "dashboard"
        dashboardItem.innerHTML = `<img id="dashboardimg" src="/Dashboard/Images/Dashboardimg.png" alt="dashimage">
            <h3>${dashboard.name}</h3>
            <p>${dashboard.description}</p>
            <a href="/Dashboard/dashboardBuilder.html?path=${dashboard.path}">Open Dashboard</a>`;

        dashboardList.appendChild(dashboardItem);
    });
}

renderDashboards();