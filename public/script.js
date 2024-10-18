// document.getElementById('product-form').onsubmit = async function(event) {
//     event.preventDefault();
//     const productName = document.getElementById('product-name').value;
//     const response = await fetch(`/search?query=${encodeURIComponent(productName)}`);
//     const results = await response.json();
//     displayResults(results);
// };

// function displayResults(results) {
//     const resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '';

//     for (const [platform, items] of Object.entries(results)) {
//         const table = document.createElement('table');
//         const headerRow = document.createElement('tr');
        
//         const header1 = document.createElement('th');
//         header1.textContent = 'Product Title';
//         const header2 = document.createElement('th');
//         header2.textContent = 'Price';
//         const header3 = document.createElement('th');
//         header3.textContent = 'Price Before Discount';
//         const header4 = document.createElement('th');
//         header4.textContent = 'Details';
        
//         headerRow.appendChild(header1);
//         headerRow.appendChild(header2);
//         headerRow.appendChild(header3);
//         headerRow.appendChild(header4);
//         table.appendChild(headerRow);

//         // Flag to check if any title contains "N/A"
//         let hasValidItems = false;

//         if (items.length > 0) {
//             items.forEach(item => {
//                 if (item.title && item.title !== 'N/A' && item.price && item.priceBeforeDiscount) {
//                     hasValidItems = true; // Mark as valid if all checks pass

//                     const row = document.createElement('tr');
//                     const titleCell = document.createElement('td');
//                     titleCell.textContent = item.title;
//                     const priceCell = document.createElement('td');
//                     priceCell.textContent = item.price;
//                     const priceBeforeDiscountCell = document.createElement('td');
//                     priceBeforeDiscountCell.textContent = item.priceBeforeDiscount || 'N/A';
//                     const linkCell = document.createElement('td');
//                     const link = document.createElement('a');
//                     link.href = item.link;
//                     link.target = "_blank";
//                     link.textContent = 'View';
//                     linkCell.appendChild(link);
                    
//                     row.appendChild(titleCell);
//                     row.appendChild(priceCell);
//                     row.appendChild(priceBeforeDiscountCell);
//                     row.appendChild(linkCell);
//                     table.appendChild(row);
//                 }
//             });
//         }

//         // If no valid items, do not add the table to the results
//         if (!hasValidItems) {
//             const noResultsRow = document.createElement('tr');
//             const noResultsCell = document.createElement('td');
//             noResultsCell.colSpan = 4;
//             noResultsCell.className = 'no-results';
//             noResultsCell.textContent = 'No valid results found.';
//             noResultsRow.appendChild(noResultsCell);
//             table.appendChild(noResultsRow);
//         } else {
//             const platformHeader = document.createElement('h2');
//             platformHeader.textContent = platform;
//             resultsDiv.appendChild(platformHeader);
//             resultsDiv.appendChild(table);
//         }
//     }
// }
//////////////////////////////////////////
// document.getElementById('product-form').onsubmit = async function(event) {
//     event.preventDefault();
//     const productName = document.getElementById('product-name').value;
//     const response = await fetch(`/search?query=${encodeURIComponent(productName)}`);
//     const results = await response.json();
//     displayResults(results);
// };

// function displayResults(results) {
//     const resultsDiv = document.getElementById('results');
//     resultsDiv.innerHTML = '';

//     for (const [platform, items] of Object.entries(results)) {
//         const table = document.createElement('table');
//         const headerRow = document.createElement('tr');

//         const header1 = document.createElement('th');
//         header1.textContent = 'Product Title';
//         const header2 = document.createElement('th');
//         header2.textContent = 'Price';
//         const header3 = document.createElement('th');
//         header3.textContent = 'Price Before Discount';
//         const header4 = document.createElement('th');
//         header4.textContent = 'Details';

//         headerRow.appendChild(header1);
//         headerRow.appendChild(header2);
//         headerRow.appendChild(header3);
//         headerRow.appendChild(header4);
//         table.appendChild(headerRow);

//         let hasValidItems = false;

//         if (items.length > 0) {
//             items.forEach(item => {
//                 // Extracting the first price from the combined price string
//                 const prices = item.price.split(/(?<=\d)(?=EGP)/); // Split by EGP to separate prices
//                 const currentPrice = prices[0] ? prices[0].trim() : 'N/A'; // First price
//                 const priceBeforeDiscount = prices[1] ? prices[1].trim() : 'N/A'; // Second price

//                 // Validate all required fields
//                 if (item.title && item.title !== 'N/A' && currentPrice && priceBeforeDiscount) {
//                     hasValidItems = true;

//                     const row = document.createElement('tr');
//                     const titleCell = document.createElement('td');
//                     titleCell.textContent = item.title;
//                     const priceCell = document.createElement('td');
//                     priceCell.textContent = currentPrice; // Use the first price
//                     const priceBeforeDiscountCell = document.createElement('td');
//                     priceBeforeDiscountCell.textContent = priceBeforeDiscount; // Use the second price
//                     const linkCell = document.createElement('td');
//                     const link = document.createElement('a');
//                     link.href = item.link;
//                     link.target = "_blank";
//                     link.textContent = 'View';
//                     linkCell.appendChild(link);

//                     row.appendChild(titleCell);
//                     row.appendChild(priceCell);
//                     row.appendChild(priceBeforeDiscountCell);
//                     row.appendChild(linkCell);
//                     table.appendChild(row);
//                 }
//             });
//         }

//         if (hasValidItems) {
//             const platformHeader = document.createElement('h2');
//             platformHeader.textContent = platform;
//             resultsDiv.appendChild(platformHeader);
//             resultsDiv.appendChild(table);
//         } else {
//             const noResultsRow = document.createElement('tr');
//             const noResultsCell = document.createElement('td');
//             noResultsCell.colSpan = 4;
//             noResultsCell.className = 'no-results';
//             noResultsCell.textContent = 'No valid results found.';
//             noResultsRow.appendChild(noResultsCell);
//             table.appendChild(noResultsRow);
//             resultsDiv.appendChild(table);
//         }
//     }
// }
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




