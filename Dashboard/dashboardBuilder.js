window.addEventListener('load', dshbrd);

function dshbrd() {
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardPath = urlParams.get("path");

    const dashboardData = JSON.parse(localStorage.getItem(`dashboard_${dashboardPath}`)) || { widgets: [] };

    if (dashboardData) {
        document.querySelector("h2").textContent = `${dashboardData.name}`;
        // Render widgets if they exist
        if (dashboardData.widgets.length > 0) {
            dashboardData.widgets.forEach(widget => {
                if (widget.type === 'table') {
                    createTable(widget.x, widget.y, widget.width, widget.height);
                } else if (widget.type === 'chart') {
                    createChart(widget.x, widget.y, widget.chartType, widget.width, widget.height);
                }
            });
        }
    } else {
        console.log("No dashboard data found for this path.");
    }
}

publishButton.onclick = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const dashboardPath = urlParams.get("path");
    const dashname = localStorage.getItem("name");

    const widgets = [];
    document.querySelectorAll('#dashboard > div').forEach(widget => {
        const widgetType = widget.id.includes('tableContainer') ? 'table' : 'chart';
        const x = parseInt(widget.style.left, 10);
        const y = parseInt(widget.style.top, 10);
        const width = widget.style.width;
        const height = widget.style.height;

        if (widgetType === 'table') {
            widgets.push({ type: widgetType, x, y, width, height });
        } else {
            const chartType = widget.querySelector('#chartTypeSelect').value;
            widgets.push({ type: widgetType, x, y, chartType, width, height });
        }
    });

    const updatedDashboardData = {
        name: "Your Dashboard",
        path: dashboardPath,
        widgets: widgets,
    };

    localStorage.setItem(`dashboard_${dashboardPath}`, JSON.stringify(updatedDashboardData));

    alert("Dashboard Published!");
    window.location.href = "/Main/mainScreen.html";
};