function redirectToViewer() {
    const fileUrl = document.getElementById('fileUrl').value;
    if (fileUrl) {
        // Redirect to sheet.html with the file URL as a query parameter
        window.location.href = `sheet.html?fileUrl=${encodeURIComponent(fileUrl)}`;
    } else {
        alert("Please enter a valid Excel file URL.");
    }
}
