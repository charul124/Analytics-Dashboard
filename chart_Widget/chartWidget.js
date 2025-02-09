let newlabels = [];
let datapoints = [];

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
            createChart(event.clientX, event.clientY); 
        }
        console.log("Dropped on Dashboard");
    });
};

function createChart(initialX = 340, initialY = 60) {
    newlabels.length = 0;
    datapoints.length = 0;

    fetch('/Data/ChartData.json')
        .then(response => response.json())
        .then(chartData => {
            const data = chartData.map(item => {
                const date = new Date(item.CurrentTime * 1000);
                const formattedDate = date.toISOString().split('T')[0]; 
                const partsSold = parseInt(item.PartsSold, 10);
                return { date: formattedDate, partsSold: partsSold };
            });
            data.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            data.forEach(item => {
                newlabels.push(item.date);
                datapoints.push(item.partsSold);
            });
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

    let chartType = 'bar';

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
    chartCard.id = 'chartCard';
    
    chartCard.style.position = 'absolute'; 
    chartCard.style.left = `${initialX}px`;
    chartCard.style.top = `${initialY}px`;
    chartCard.setAttribute('draggable', true);
    
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
    // canvas.style.height = '300px';
    // canvas.style.width = '563px';
    canvas.id = 'myChart';

    const chartTypeSelect = document.createElement('select');
    chartTypeSelect.id = 'chartTypeSelect';

    ['bar', 'line', 'pie'].forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.slice(0);
        chartTypeSelect.appendChild(option);
    });

    chartTypeSelect.addEventListener('change', (event) => {
        chartType = event.target.value;
        myChart.destroy();
        config.type = chartType;
        myChart = new Chart(canvas, config);
    });

    const indate = document.createElement('input');
    indate.type = 'date';
    indate.id = 'startdate';
    indate.value = '2024-02-18';
    indate.onchange = filterdate;
    chartCard.appendChild(indate);

    const outdate = document.createElement('input');
    outdate.type = 'date';
    outdate.id = 'enddate';
    outdate.value = '2025-03-25';
    outdate.onchange = filterdate;
    chartCard.appendChild(outdate);

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times';
    deleteButton.id = 'tbldelete';
    deleteButton.addEventListener('click', () => {
        chartCard.remove();
    });

    chartCard.appendChild(chartTypeSelect);
    chartCard.appendChild(deleteButton);
    chartCard.appendChild(canvas);

    let myChart = new Chart(canvas, config);

    function filterdate() {
        const dates2 = [...newlabels];
        console.log('Dates array:', dates2);

        const startdate = new Date(document.getElementById('startdate').value);
        const enddate = new Date(document.getElementById('enddate').value);

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
