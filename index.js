require('dotenv').config(); 

const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios'); 

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
