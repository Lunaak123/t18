document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileUrl = urlParams.get('fileUrl');

    if (fileUrl) {
        await loadExcelSheet(fileUrl);
    } else {
        alert("No file URL provided.");
    }
});

async function loadExcelSheet(fileUrl) {
    try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

        const sheetNames = workbook.SheetNames;
        const subsheetSelect = document.getElementById('subsheet-select');
        
        // Populate subsheet dropdown with sheet names
        sheetNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            subsheetSelect.appendChild(option);
        });

        // Load the first sheet by default
        loadSheetData(workbook, sheetNames[0]);

        // Update sheet data on sheet selection
        subsheetSelect.addEventListener('change', () => {
            loadSheetData(workbook, subsheetSelect.value);
        });
    } catch (error) {
        console.error("Error loading Excel file:", error);
    }
}

function loadSheetData(workbook, sheetName) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { defval: null });
    displaySheetData(data);
}

function displaySheetData(data) {
    const table = document.getElementById('data-table');
    table.innerHTML = ''; // Clear previous data

    if (data.length > 0) {
        // Generate table headers
        const headerRow = table.insertRow();
        Object.keys(data[0]).forEach(key => {
            const cell = document.createElement('th');
            cell.textContent = key;
            headerRow.appendChild(cell);
        });

        // Generate table rows
        data.forEach(rowData => {
            const row = table.insertRow();
            Object.values(rowData).forEach(value => {
                const cell = row.insertCell();
                cell.textContent = value !== null ? value : '';
            });
        });
    } else {
        // Display message if no data
        const row = table.insertRow();
        const cell = row.insertCell();
        cell.colSpan = "100%";
        cell.textContent = "No data available.";
    }
}
