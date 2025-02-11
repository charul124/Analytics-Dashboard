let newlabels = [];
let datapoints = [];
let chartCounter = 1;
window.onload = () => {
    // Select table button and dashboard area
    const chrtButton = document.getElementById('chrtbtn');
    const dashboard = document.getElementById('dashboard');

    chrtButton.setAttribute('draggable', true);

    chrtButton.addEventListener('dragstart', (event) => {
        console.log("Dragging Started");
        event.dataTransfer.setData('widgetType', 'chart');
    });

    dashboard.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    dashboard.addEventListener('drop', (event) => {
        event.preventDefault();
        const widgetType = event.dataTransfer.getData('widgetType');
        if (widgetType === 'chart') {
            createChart(event.clientX, event.clientY, 'bar', '500px', '300px', '2024-02-18', '2025-03-25', null, chartCounter);
        }
        console.log("Dropped on Dashboard");
    });
};

function createChart(initialX = 340, initialY = 60, chartType = 'bar', width = '500px', height = '300px', startDate = '2024-02-18', endDate = '2025-03-25', chartData = null, chartId = chartCounter++) {
    newlabels.length = 0;
    datapoints.length = 0;

    fetch('/Data/ChartData.json')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(item => {
                const date = new Date(item.CurrentTime * 1000);
                return date >= new Date(startDate) && date <= new Date(endDate);
            });

            filteredData.forEach(item => {
                const date = new Date(item.CurrentTime * 1000);
                const formattedDate = date.toISOString().split('T')[0];
                newlabels.push(formattedDate);
                datapoints.push(item.PartsSold);
            });

            if (chartData && chartData.labels && chartData.datasets && chartData.datasets[0] && chartData.datasets[0].data) {
                newlabels = chartData.labels;
                datapoints = chartData.datasets[0].data;
            }

            myChart.update();
        });

    const data = {
        labels: newlabels,
        datasets: [{
            label: 'No. of parts sold',
            data: datapoints,
            backgroundColor: ['#D0DBF8'],
            borderColor: ['#062F6F'],
            borderWidth: 1
        }]
    };

    const config = {
        type: chartType,
        data,
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Total no. of Parts',
                    color: '#062F6F',
                    position: 'left',
                    align: 'center',
                    font: { weight: 'bold' },
                    padding: 8,
                    fullSize: true,
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    };

    const chartContainer = document.getElementById('dashboard');
    const chartCard = document.createElement('div');
    chartContainer.appendChild(chartCard);
    chartCard.id = chartId;

    chartCard.style.position = 'absolute';
    chartCard.style.left = `${initialX}px`;
    chartCard.style.top = `${initialY}px`;
    chartCard.style.width = width;
    chartCard.style.height = height;
    chartCard.style.boxShadow = '2px 2px 5px 2px #cecece'
    chartCard.style.padding = '10px'
    chartCard.style.margin ='10px'
    chartCard.style.borderRadius = '5px'
    chartCard.setAttribute('draggable', true);
    chartCard.style.resize = "both";
    chartCard.style.overflow = 'auto';

    chartCard.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', 'dragging');
        offsetX = event.offsetX;
        offsetY = event.offsetY;
    });

    chartCard.addEventListener('dragend', (event) => {
        chartCard.style.left = `${event.clientX - offsetX}px`;
        chartCard.style.top = `${event.clientY - offsetY}px`;
    });

    const canvas = document.createElement('canvas');
    canvas.id = `${chartId}-canvas`;

    const chartTypeSelect = document.createElement('select');
    chartTypeSelect.id = `${chartId}-chartTypeSelect`;

    ['bar', 'line', 'pie'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.slice(0);
        chartTypeSelect.appendChild(option);
    });

    chartTypeSelect.value = chartType;

    chartTypeSelect.addEventListener('change', (event) => {
        chartType = event.target.value;
        myChart.destroy();
        config.type = chartType;
        myChart = new Chart(canvas, config);
    });
    chartTypeSelect.style.borderRadius = '5px'
    chartTypeSelect.style.height = "30px";
    chartTypeSelect.style.width ='100px';
    chartTypeSelect.style.paddin = '5px';
    chartTypeSelect.style.margin = '5px';
    chartTypeSelect.style.border = '1px solid #062F6F';

    const indate = document.createElement('input');
    indate.type = 'date';
    indate.id = `${chartId}-startdate`;
    indate.value = startDate;
    
    const outdate = document.createElement('input');
    outdate.type = 'date';
    outdate.id = `${chartId}-enddate`;
    outdate.value = endDate;

    indate.style.height = '18px'
    indate.style.width = '100px'
    indate.style.padding = '5px'
    indate.style.margin = '5px'
    indate.style.borderRadius = '5px'
    indate.style.border = '1px solid #062F6F'
    outdate.style.height = '18px'
    outdate.style.width = '100px'
    outdate.style.padding = '5px'
    outdate.style.margin = '5px'
    outdate.style.borderRadius = '5px'
    outdate.style.border = '1px solid #062F6F'

    indate.addEventListener('change', () => filterdate(chartId)(indate.value, outdate.value));
    outdate.addEventListener('change', () => filterdate(chartId)(indate.value, outdate.value));

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times';
    deleteButton.id = `${chartId}-deleteButton`;
    deleteButton.addEventListener('click', () => {
        chartCard.remove();
    });
    deleteButton.style.position = 'absolute'
    deleteButton.style.right = '12px'
    deleteButton.style.marginTop = '8px'

    chartCard.appendChild(chartTypeSelect);
    chartCard.appendChild(indate);
    chartCard.appendChild(outdate);
    chartCard.appendChild(deleteButton);
    chartCard.appendChild(canvas);

    let myChart = new Chart(canvas, config);

    const filterdate = chartId => (startDate, endDate) => {
        const dates2 = [...newlabels];
        console.log("Start date is :", startDate);
        console.log("End date is :", endDate);

        const startdate = new Date(startDate);
        const enddate = new Date(endDate);

        console.log("New Start date is :", startDate);
        console.log("New End date is :", endDate);
        let currentDate = new Date(startdate);
        const allDates = [];

        while (currentDate <= enddate) {
            allDates.push(new Date(currentDate).toISOString().split('T')[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const datefilter = allDates.filter(date => dates2.includes(date));
        console.log('Filtered dates:', datefilter);

        myChart.config.data.labels = datefilter;
        myChart.update();
    }
}
