export const loadXLSX = () => {
    return new Promise((resolve) => {
        if (window.XLSX && window.XLSX.utils && window.XLSX.utils.book_new) {
            resolve(window.XLSX);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js';
        script.onload = () => resolve(window.XLSX);
        document.body.appendChild(script);
    });
};

export const exportDataToExcel = async (wsData, filename, colWidths = []) => {
    const XLSX = await loadXLSX();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Apply styles to all cells in the worksheet
    for (let i in ws) {
        if (i[0] === '!') continue;
        
        const col = i.replace(/[0-9]/g, '');
        const row = parseInt(i.replace(/[A-Z]/g, ''), 10);
        
        let cellStyle = {
            border: {
                top: { style: "thin", color: { auto: 1 } },
                bottom: { style: "thin", color: { auto: 1 } },
                left: { style: "thin", color: { auto: 1 } },
                right: { style: "thin", color: { auto: 1 } }
            },
            font: { name: "Arial", sz: 10 }
        };

        // Title rows (rows 1 and 2) get no borders; row 1 gets bold 14pt
        if (row === 1 || row === 2) {
            cellStyle.border = {};
            if (row === 1) cellStyle.font = { name: "Arial", sz: 14, bold: true };
        }
        
        // Table Headers (Row 15) or Summary Headers (left column of metadata)
        // Row 15 is 15-indexed since header starts at row 15 in target array representation
        if (row === 15 || (col === 'A' && ((row >= 4 && row <= 8) || (row >= 10 && row <= 12)))) {
            cellStyle.fill = { fgColor: { rgb: "E5E7EB" } }; // light gray
            cellStyle.font = { name: "Arial", sz: 10, bold: true };
        }

        ws[i].s = cellStyle;
    }

    if (colWidths.length > 0) {
        ws['!cols'] = colWidths;
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Rapport");
    XLSX.writeFile(wb, filename);
};
