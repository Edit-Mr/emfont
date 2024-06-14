const fs = require('fs');
const path = require('path');

const fontsFilePath = path.join(__dirname, 'Database', 'fonts.json');
const readmeFilePath = path.join(__dirname, 'README.md');

// Read and parse the fonts.json file
const fontsData = JSON.parse(fs.readFileSync(fontsFilePath, 'utf8'));

// Function to convert JSON data to a markdown table
function generateMarkdownTable(data) {
    const headers = ['Font ID', '中文名稱', '英文名稱', '字體風格', '字種', 'Class', '版本', '許可證', '來源'];
    const rows = Object.entries(data).map(([id, details]) => {
        const { name, style, weight, class: className, version, license, source } = details;
        return [
            id,
            name.zh || '',
            name.en || '',
            style || '',
            weight.join(', ') || '',
            className || '',
            version || '',
            license || '',
            source || ''
        ].join(' | ');
    });

    const table = [
        headers.join(' | '),
        headers.map(() => '---').join(' | '),
        ...rows
    ].join('\n');

    return table;
}

// Generate the markdown table
const markdownTable = generateMarkdownTable(fontsData);

// Read the current README.md file
const readmeContent = fs.readFileSync(readmeFilePath, 'utf8');

// Update the section of the README.md file where the table should be inserted
const updatedReadmeContent = readmeContent.replace(
    /<!-- fonts table start -->[\s\S]*<!-- fonts table end -->/,
    `<!-- fonts table start -->\n${markdownTable}\n<!-- fonts table end -->`
);

// Write the updated README.md file
fs.writeFileSync(readmeFilePath, updatedReadmeContent);

console.log('README.md has been updated');
