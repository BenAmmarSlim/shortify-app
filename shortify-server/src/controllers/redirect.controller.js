const express = require('express');
const router = express.Router();
const {URLModel} = require('../models/url.model');

router.get('/:urlCode', async (req, res) => {
    try {
        const {urlCode} = req.params;
        const urlRecord = await URLModel.findOne({urlCode});

        if (!urlRecord) {
            return res.status(404).json({message: 'URL not found'});
        }

        res.redirect(urlRecord.longUrl);
    } catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).json({message: 'Internal Server Error'});
    }
});

module.exports = router;