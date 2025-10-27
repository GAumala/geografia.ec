const fs = require('fs');
const path = require('path');

// Function to capitalize a single word, handling special cases and parentheses
function capitalizeWord(word, isFirstWord = false) {
    if (!word) return '';
    
    // Handle special cases for common words
    const specialWords = {
        'de': 'de',
        'del': 'del',
        'la': 'la',
        'el': 'el',
        'los': 'los',
        'las': 'las',
        'y': 'y',
        'en': 'en',
        'con': 'con',
        'por': 'por',
        'para': 'para',
        'al': 'al',
        'da': 'da',
        'do': 'do',
        'dos': 'dos',
        'das': 'das',
        'e': 'e',
        'o': 'o',
        'a': 'a',
        'ao': 'ao',
        'aos': 'aos',
        'as': 'as'
    };
    
    // Handle words that start with parentheses
    if (word.startsWith('(')) {
        const content = word.slice(1); // Remove opening parenthesis
        
        // Recursively capitalize the content inside parentheses
        const capitalizedContent = capitalizeWord(content, true); // Treat as first word
        return '(' + capitalizedContent;
    }
    
    // If it's a special word, keep it lowercase UNLESS it's the first word
    if (specialWords[word] && !isFirstWord) {
        return specialWords[word];
    }
    
    // Capitalize the first letter of each word
    return word.charAt(0).toUpperCase() + word.slice(1);
}

// Function to convert text to proper capitalization
function toProperCase(text) {
    if (!text) return '';
    
    return text.toLowerCase()
        .split(' ')
        .map((word, index) => capitalizeWord(word, index === 0))
        .join(' ');
}

// Function to parse CSV content
function parseCSV(csvContent) {
    const lines = csvContent.split('\n');
    const data = [];
    
    // Skip header lines (first 2 lines are empty/headers)
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Split by comma and clean up quotes
        const columns = line.split(',').map(col => col.replace(/"/g, '').trim());
        
        if (columns.length >= 7) {
            let cantonNombre = columns[4];
            
            // Fix Quito canton name
            if (cantonNombre === 'DISTRITO METROPOLITANO DE QUITO') {
                cantonNombre = 'QUITO';
            }
            
            data.push({
                provinciaCodigo: columns[1],
                provinciaNombre: columns[2],
                cantonCodigo: columns[3],
                cantonNombre: cantonNombre,
                parroquiaCodigo: columns[5],
                parroquiaNombre: columns[6]
            });
        }
    }
    
    return data;
}

// Function to convert CSV data to the desired JSON structure
function convertToJSON(csvData) {
    const provinces = {};
    
    // Group data by province
    csvData.forEach(row => {
        const provinciaNombre = row.provinciaNombre;
        const cantonNombre = row.cantonNombre;
        const parroquiaNombre = row.parroquiaNombre;
        
        if (!provinciaNombre || !cantonNombre || !parroquiaNombre) return;
        
        // Initialize province if it doesn't exist
        if (!provinces[provinciaNombre]) {
            provinces[provinciaNombre] = {
                nombre: toProperCase(provinciaNombre),
                cantones: {}
            };
        }
        
        // Initialize canton if it doesn't exist
        if (!provinces[provinciaNombre].cantones[cantonNombre]) {
            provinces[provinciaNombre].cantones[cantonNombre] = {
                nombre: toProperCase(cantonNombre),
                parroquias: []
            };
        }
        
        // Add parish if it doesn't already exist
        const parroquiaProperCase = toProperCase(parroquiaNombre);
        if (!provinces[provinciaNombre].cantones[cantonNombre].parroquias.includes(parroquiaProperCase)) {
            provinces[provinciaNombre].cantones[cantonNombre].parroquias.push(parroquiaProperCase);
        }
    });
    
    // Convert to array format
    const result = Object.values(provinces).map(province => ({
        nombre: province.nombre,
        cantones: Object.values(province.cantones).map(canton => ({
            nombre: canton.nombre,
            parroquias: canton.parroquias.sort() // Sort parishes alphabetically
        })).sort((a, b) => a.nombre.localeCompare(b.nombre)) // Sort cantons alphabetically
    })).sort((a, b) => a.nombre.localeCompare(b.nombre)); // Sort provinces alphabetically
    
    return result;
}

// Main function
function main() {
    try {
        console.log('Reading CSV file...');
        const csvContent = fs.readFileSync('codificacion.csv', 'utf8');
        
        console.log('Parsing CSV data...');
        const csvData = parseCSV(csvContent);
        console.log(`Parsed ${csvData.length} rows`);
        
        console.log('Converting to JSON structure...');
        const jsonData = convertToJSON(csvData);
        
        console.log('Writing provincias.json file...');
        fs.writeFileSync('provincias.json', JSON.stringify(jsonData, null, 2), 'utf8');
        
        console.log('✅ Conversion completed successfully!');
        console.log(`📊 Generated data for ${jsonData.length} provinces`);
        
        // Show some statistics
        let totalCantons = 0;
        let totalParishes = 0;
        
        jsonData.forEach(province => {
            totalCantons += province.cantones.length;
            province.cantones.forEach(canton => {
                totalParishes += canton.parroquias.length;
            });
        });
        
        console.log(`📈 Statistics:`);
        console.log(`   - ${jsonData.length} provinces`);
        console.log(`   - ${totalCantons} cantons`);
        console.log(`   - ${totalParishes} parishes`);
        
        // Show a sample of the data
        console.log('\n📋 Sample data (first province):');
        console.log(JSON.stringify(jsonData[0], null, 2));
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run the script
main();
