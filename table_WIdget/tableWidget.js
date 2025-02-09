let tableCounter = 0; // Counter to assign unique IDs
window.addEventListener('load', dragTable);

function dragTable(){
    const tblButton = document.getElementById('tblbtn');
    const dashboard = document.getElementById('dashboard');

    tblButton.setAttribute('draggable', true);

    tblButton.addEventListener('dragstart', (event) => {
        console.log("Dragging Started");
        event.dataTransfer.setData('widgetType', 'table');
    });

    dashboard.addEventListener('dragover', (event) => {
        console.log("Dragging Over");
        event.preventDefault();
    });

    dashboard.addEventListener('drop', (event) => {
        event.preventDefault();
        const widgetType = event.dataTransfer.getData('widgetType');
        if (widgetType === 'table') {
            createTable();
        }
        console.log("I have been Dropped");
    });
};

function createTable(initialX = 940, initialY = 60) {
    fetch('/Data/TableData.json')
        .then(response => response.json())
        .then(tableData => {
            tableCounter++;

            const tableCard = document.getElementById('dashboard');
            const tableContainer = document.createElement('div');
            tableContainer.id = `tableContainer-${tableCounter}`;
            tableCard.appendChild(tableContainer);

            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '&times';
            deleteButton.id = 'tbldelete';
            deleteButton.addEventListener('click', () => {
                tableContainer.remove();
            });

            const table = document.createElement('table');
            table.id = `myTable-${tableCounter}`;
            

            const searching = document.createElement("input");
            searching.classList = 'search';
            searching.type = "search";
            searching.placeholder = "Search here...";
            searching.addEventListener('input', () => searchTable(tableContainer.id));
            tableContainer.appendChild(searching);
            tableContainer.appendChild(deleteButton);
            tableContainer.appendChild(table);

            tableContainer.style.position = 'absolute'; 
            tableContainer.style.left = `${initialX}px`;
            tableContainer.style.top = `${initialY}px`;
            tableContainer.setAttribute('draggable', true);
            tableContainer.style.padding = '10px'
            tableContainer.style.width = 'fit-content'
            tableContainer.style.margin = '10px'
            tableContainer.style.borderRadius = '5px'
            tableContainer.style.boxShadow = '2px 2px 5px 2px #cecece'
            tableContainer.style.height = '338px'
            tableContainer.style.overflow = 'scroll'

            tableContainer.addEventListener('dragstart', (event) => {
                event.dataTransfer.setData('text/plain', 'dragging');
                offsetX = event.offsetX;
                offsetY = event.offsetY;
            });

            tableContainer.addEventListener('dragend', (event) => {
                tableContainer.style.left = `${event.clientX - offsetX}px`;
                tableContainer.style.top = `${event.clientY - offsetY}px`;
            });

            const headers = Object.keys(tableData[0]);
            headers.forEach(header => {
                const th = document.createElement('th');
                th.innerHTML = header;
                th.setAttribute('data-column-index', headers.indexOf(header));
                th.addEventListener('click', () => sortTable(table.id, headers.indexOf(header)));
                table.appendChild(th);
            });

            tableData.forEach(rowData => {
                const row = document.createElement('tr');
                row.setAttribute('name', `table-rows-${tableCounter}`);
                headers.forEach(column => {
                    const cell = document.createElement('td');
                    cell.innerHTML = rowData[column];
                    row.appendChild(cell);
                });
                table.appendChild(row);
            });
        });
}


function searchTable(containerId) {
    const tableContainer = document.getElementById(containerId);
    if (!tableContainer) {
        console.error('Table container not found with ID:', containerId);
        return;
    }
    const input = tableContainer.querySelector('.search');
    if (!input) {
        console.error('Search input not found in container with ID:', containerId);
        return;
    }
    const table = tableContainer.querySelector('table');
    if (!table) {
        console.error('Table not found in container with ID:', containerId);
        return;
    }
    const filter = input.value.toLowerCase();
    const tr = table.getElementsByTagName('tr');

    for (let i = 1; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName('td');
        let showRow = false;
        for (let j = 0; j < td.length; j++) {
            if (td[j]) {
                const txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    showRow = true;
                    break;
                }
            }
        }
        tr[i].style.display = showRow ? '' : 'none';
    }
    
}

let sortOrder = true;

function sortTable(tableId, column) {
    const table = document.getElementById(tableId);
    const rows = Array.from(table.querySelectorAll(`tr[name^="table-rows"]`));
    const sortedRows = rows.sort((a, b) => {
        let firstRow = a.querySelectorAll('td')[column].textContent;
        let secondRow = b.querySelectorAll('td')[column].textContent;
        if (firstRow < secondRow) return sortOrder ? -1 : 1;
        if (firstRow > secondRow) return sortOrder ? 1 : -1;
        return 0;
    });

    sortedRows.forEach(sortedRow => table.appendChild(sortedRow));
    sortOrder = !sortOrder;
}
