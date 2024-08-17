const express = require('express');
const router = express.Router();

router.get('/location1', (req, res) => {
    const location = req.params.location;
    const locationDetails = getLocationDetails(location);
    res.render(location, { title: locationDetails.title, details: locationDetails.details });
});
router.get('/location2', (req, res) => {
    const location = req.params.location;
    const locationDetails = getLocationDetails(location);
    res.render(location, { title: locationDetails.title, details: locationDetails.details });
});
router.get('/location3', (req, res) => {
    const location = req.params.location;
    const locationDetails = getLocationDetails(location);
    res.render(location, { title: locationDetails.title, details: locationDetails.details });
});
router.get('/location4', (req, res) => {
    const location = req.params.location;
    const locationDetails = getLocationDetails(location);
    res.render(location, { title: locationDetails.title, details: locationDetails.details });
});
router.get('/location5', (req, res) => {
    const location = req.params.location;
    const locationDetails = getLocationDetails(location);
    res.render(location, { title: locationDetails.title, details: locationDetails.details });
});

function getLocationDetails(location) {
    // Add more locations as needed
    const locations = {
        location1: { title: 'Location 1', details: 'Details about Location 1' },
        location2: { title: 'Location 2', details: 'Details about Location 1' },
        location3: { title: 'Location 3', details: 'Details about Location 1' },
        location4: { title: 'Location 4', details: 'Details about Location 1' },
        location5: { title: 'Location 5', details: 'Details about Location 2' }
    };
    return locations[location] || { title: 'Unknown Location', details: 'No details available.' };
}

module.exports = router;
