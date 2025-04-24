// Frontend Code
document.getElementById('product-form').onsubmit = async function(event) {
    event.preventDefault();
    const productName = document.getElementById('product-name').value;
    const response = await fetch(`/search?query=${encodeURIComponent(productName)}`);
    const results = await response.json();
    displayResults(results);
};

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    for (const [platform, items] of Object.entries(results)) {
        const table = document.createElement('table');
        const headerRow = document.createElement('tr');

        const header1 = document.createElement('th');
        header1.textContent = 'Product Title';
        const header2 = document.createElement('th');
        header2.textContent = 'Price';
        const header3 = document.createElement('th');
        header3.textContent = 'Price Before Discount';
        const header4 = document.createElement('th');
        header4.textContent = 'Details';

        headerRow.appendChild(header1);
        headerRow.appendChild(header2);
        headerRow.appendChild(header3);
        headerRow.appendChild(header4);
        table.appendChild(headerRow);

        let hasValidItems = false;

        if (items.length > 0) {
            items.forEach(item => {
                const currentPrice = item.price.trim() || 'N/A'; // Use item.price directly
                const priceBeforeDiscount = item.priceBeforeDiscount.trim() || 'N/A'; // Use item.priceBeforeDiscount

                // Validate all required fields
                if (item.title && item.title !== 'N/A' && currentPrice && priceBeforeDiscount) {
                    hasValidItems = true;

                    const row = document.createElement('tr');
                    const titleCell = document.createElement('td');
                    titleCell.textContent = item.title;
                    const priceCell = document.createElement('td');
                    priceCell.textContent = currentPrice; // Use the first price
                    const priceBeforeDiscountCell = document.createElement('td');
                    priceBeforeDiscountCell.textContent = priceBeforeDiscount; // Use the second price
                    const linkCell = document.createElement('td');
                    const link = document.createElement('a');
                    link.href = item.link;
                    link.target = "_blank";
                    link.textContent = 'View';
                    linkCell.appendChild(link);

                    row.appendChild(titleCell);
                    row.appendChild(priceCell);
                    row.appendChild(priceBeforeDiscountCell);
                    row.appendChild(linkCell);
                    table.appendChild(row);
                }
            });
        }

        if (hasValidItems) {
            const platformHeader = document.createElement('h2');
            platformHeader.textContent = platform;
            resultsDiv.appendChild(platformHeader);
            resultsDiv.appendChild(table);
        } else {
            const noResultsRow = document.createElement('tr');
            const noResultsCell = document.createElement('td');
            noResultsCell.colSpan = 4;
            noResultsCell.className = 'no-results';
            noResultsCell.textContent = 'No valid results found.';
            noResultsRow.appendChild(noResultsCell);
            table.appendChild(noResultsRow);
            resultsDiv.appendChild(table);
        }
    }
}




