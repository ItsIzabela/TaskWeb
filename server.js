const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;  // Używamy portu 3001

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Trasa główna
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint do zapisu wyników
app.post('/submit-answer', (req, res) => {
    const result = req.body;

    console.log('Received result:', result);  // Dodano logowanie otrzymanych danych

    // Odczytaj istniejące wyniki
    fs.readFile('results.json', 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading results file:', err);  // Logowanie błędów odczytu
            return res.status(500).json({ error: 'Could not read results file' });
        }

        const results = data ? JSON.parse(data) : [];
        results.push(result);

        // Zapisz zaktualizowane wyniki
        fs.write
        fs.writeFile('results.json', JSON.stringify(results, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing to results file:', err);  // Logowanie błędów zapisu
                return res.status(500).json({ error: 'Could not write to results file' });
            }

            console.log('Result saved successfully');  // Logowanie pomyślnego zapisu
            res.status(200).json({ message: 'Result saved successfully' });
        });
    });
});

// Uruchom serwer
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
