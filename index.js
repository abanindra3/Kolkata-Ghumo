/*require('dotenv').config(); 

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios'); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});


app.get('/tour-planner', (req, res) => {
    res.render('tour-planner', { title: 'Tour Planner' });
});

app.post('/generate-itinerary', async (req, res) => {
    const { name, startDate, endDate, preferredPlaces } = req.body;

    try {
        const itineraryData = await generateAIItinerary(name, startDate, endDate, preferredPlaces);
        res.render('itinerary', { title: 'Your Itinerary', itinerary: itineraryData.itinerary });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating itinerary');
    }
});

async function generateAIItinerary(name, startDate, endDate, preferredPlaces) {
    const prompt = `Create a detailed travel itinerary for ${name} from ${startDate} to ${endDate} in Kolkata. Preferred places: ${preferredPlaces || 'None specified'}.`;

    try {
        const response = await axios({
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
            method: "post",
            data: {
                contents: [{ parts: [{ text: prompt }] }],
            },
        });

        const itineraryText = response.data.candidates[0].content.parts[0].text.trim();
        const itinerary = itineraryText.split("\n\n").map((day, index) => {
            const [dayTitle, ...details] = day.split("\n");
            return {
                day: dayTitle || `Day ${index + 1}`,
                place: details.join(", "),
                details: details.join(", "),
            };
        });

        return { name, itinerary };
    } catch (error) {
        console.error("Error generating AI itinerary:", error);
        throw error;
    }
}


app.get('/location1', (req, res) => {
    res.render('location1', { title: 'Location 1', location: 'Location 1', details: 'Details about Location 1', layout: 'layout' });
});

app.get('/location2', (req, res) => {
    res.render('location2', { title: 'Location 2', location: 'Location 2', details: 'Details about Location 2', layout: 'layout' });
});

app.get('/location3', (req, res) => {
    res.render('location3', { title: 'Location 3', location: 'Location 3', details: 'Details about Location 3', layout: 'layout' });
});

app.get('/location4', (req, res) => {
    res.render('location4', { title: 'Location 4', location: 'Location 4', details: 'Details about Location 4', layout: 'layout' });
});

app.get('/location5', (req, res) => {
    res.render('location5', { title: 'Location 5', location: 'Location 5', details: 'Details about Location 5', layout: 'layout' });
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});


//download part now

const PDFDocument = require('pdfkit');
const fs = require('fs');

app.post('/download-itinerary', (req, res) => {
    const { name, itinerary } = req.body;

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'public', 'downloads', `Itinerary_${name}.pdf`);
    
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Your Tour Itinerary', { align: 'center' });
    doc.fontSize(16).text(`Name: ${name}\n\n`);

    itinerary.forEach(day => {
        doc.fontSize(14).text(day.day, { underline: true });
        doc.fontSize(12).text(`Details: ${day.details}\nPlace: ${day.place}\n\n`);
    });

    doc.end();

    doc.on('finish', () => {
        res.download(filePath, `Itinerary_${name}.pdf`, (err) => {
            if (err) {
                console.error(err);
            } else {
                
                fs.unlink(filePath, (err) => {
                    if (err) console.error(err);
                });
            }
        });
    });
});
*/
require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// Setup middleware
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'public', 'downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

app.get('/tour-planner', (req, res) => {
    res.render('tour-planner', { title: 'Tour Planner' });
});

app.post('/generate-itinerary', async (req, res) => {
    const { name, startDate, endDate, preferredPlaces } = req.body;

    try {
        const itineraryData = await generateAIItinerary(name, startDate, endDate, preferredPlaces);
        res.render('itinerary', { 
            title: 'Your Itinerary', 
            itinerary: itineraryData.itinerary,
            name: name 
        });
    } catch (error) {
        console.error('Detailed error:', error);
        res.render('error', { 
            title: 'Error', 
            message: 'Error generating itinerary. Please try again later.',
            details: error.message
        });
    }
});

async function generateAIItinerary(name, startDate, endDate, preferredPlaces) {
    const prompt = `Create a detailed travel itinerary for ${name} from ${startDate} to ${endDate} in Kolkata. Preferred places: ${preferredPlaces || 'None specified'}. Format the response as follows for each day:
    Day X: [Date]
    - Morning: [Activity/Place]
    - Afternoon: [Activity/Place]
    - Evening: [Activity/Place]`;

    try {
        // Verify API key is set
        if (!process.env.GOOGLE_GEMINI_API_KEY) {
            throw new Error('API key is not configured. Please check your .env file.');
        }

        const response = await axios({
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_GEMINI_API_KEY}`,
            method: "post",
            data: {
                contents: [{ parts: [{ text: prompt }] }],
            },
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Log the response structure for debugging
        console.log('API Response Structure:', JSON.stringify(response.data, null, 2));

        // Updated parsing to handle potential response format changes
        let itineraryText = '';
        if (response.data && response.data.candidates && response.data.candidates[0]?.content?.parts) {
            itineraryText = response.data.candidates[0].content.parts[0].text.trim();
        } else {
            throw new Error('Unexpected API response format');
        }

        // More robust parsing of the itinerary text
        const dayBlocks = itineraryText.split(/Day \d+/).filter(block => block.trim().length > 0);
        
        const itinerary = [];
        let currentDay = 1;
        
        if (dayBlocks.length === 0) {
            // If the split doesn't work, try an alternative approach
            const paragraphs = itineraryText.split('\n\n');
            paragraphs.forEach((paragraph, index) => {
                if (paragraph.trim().length > 0) {
                    itinerary.push({
                        day: `Day ${index + 1}`,
                        details: paragraph.trim(),
                        place: extractPlaces(paragraph)
                    });
                }
            });
        } else {
            dayBlocks.forEach(block => {
                const lines = block.trim().split('\n');
                const dayTitle = `Day ${currentDay}: ${lines[0] || ''}`.trim();
                const details = lines.slice(1).join('\n').trim();
                
                itinerary.push({
                    day: dayTitle,
                    details: details,
                    place: extractPlaces(details)
                });
                
                currentDay++;
            });
        }

        return { name, itinerary };
    } catch (error) {
        console.error("Error generating AI itinerary:", error.response ? error.response.data : error.message);
        throw new Error(error.response ? 
            `API Error: ${JSON.stringify(error.response.data)}` : 
            `Error: ${error.message}`);
    }
}

// Helper function to extract place names from text
function extractPlaces(text) {
    const places = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
        // Look for place names, typically after colons or hyphens
        const match = line.match(/(?::|-)(.+)/);
        if (match && match[1]) {
            places.push(match[1].trim());
        }
    });
    
    return places.length > 0 ? places.join(', ') : 'Details available in itinerary';
}

// Location routes
app.get('/location1', (req, res) => {
    res.render('location1', { title: 'Location 1', location: 'Location 1', details: 'Details about Location 1', layout: 'layout' });
});

app.get('/location2', (req, res) => {
    res.render('location2', { title: 'Location 2', location: 'Location 2', details: 'Details about Location 2', layout: 'layout' });
});

app.get('/location3', (req, res) => {
    res.render('location3', { title: 'Location 3', location: 'Location 3', details: 'Details about Location 3', layout: 'layout' });
});

app.get('/location4', (req, res) => {
    res.render('location4', { title: 'Location 4', location: 'Location 4', details: 'Details about Location 4', layout: 'layout' });
});

app.get('/location5', (req, res) => {
    res.render('location5', { title: 'Location 5', location: 'Location 5', details: 'Details about Location 5', layout: 'layout' });
});

// PDF download
app.post('/download-itinerary', (req, res) => {
    const { name, itinerary } = req.body;
    
    // Parse itinerary if it's a string (from form submission)
    const itineraryData = typeof itinerary === 'string' ? JSON.parse(itinerary) : itinerary;

    const doc = new PDFDocument();
    const filePath = path.join(__dirname, 'public', 'downloads', `Itinerary_${name}.pdf`);
    
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text('Your Tour Itinerary', { align: 'center' });
    doc.fontSize(16).text(`Name: ${name}\n\n`);

    itineraryData.forEach(day => {
        doc.fontSize(14).text(day.day, { underline: true });
        doc.fontSize(12).text(`Details: ${day.details}\n\n`);
    });

    doc.end();

    doc.on('finish', () => {
        res.download(filePath, `Itinerary_${name}.pdf`, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error downloading the file');
            } else {
                fs.unlink(filePath, (err) => {
                    if (err) console.error(err);
                });
            }
        });
    });
});

// Error route
app.get('/error', (req, res) => {
    res.render('error', { 
        title: 'Error', 
        message: 'An error occurred',
        details: 'Please try again later.'
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
