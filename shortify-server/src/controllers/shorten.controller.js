const express = require("express");
const router = express.Router();
const validUrl = require("valid-url");
const {URLModel} = require("../models/url.model");
const {generateShortId} = require("../utils/utils");

const BASE_URL = process.env.BASE_URI;

const generateUniqueShortId = async () => {
    let shortId;
    let existingUrlRecord;

    do {
        shortId = generateShortId();
        existingUrlRecord = await URLModel.findOne({urlCode: shortId});
    } while (existingUrlRecord);

    return shortId;
};

router.post("/shorten", async (req, res) => {
    try {
        const {longUrl, urlCode} = req.body;

        if (!validUrl.isUri(longUrl)) {
            return res.status(400).json({error: "Invalid URL"});
        }

        if (urlCode) {
            const existingCode = await URLModel.findOne({urlCode});
            if (existingCode) {
                return res.status(400).json({
                    error: `Code '${urlCode}' is already in use. Please choose a different one.`,
                });
            }
        }

        const existingUrlRecord = await URLModel.findOne({longUrl});
        if (existingUrlRecord && !urlCode) {
            return res.json({urlCode: existingUrlRecord.urlCode});
        }

        const generatedCode = urlCode || (await generateUniqueShortId());
        const shortUrl = `${BASE_URL}/${generatedCode}`;

        const newUrlRecord = new URLModel({
            urlCode: generatedCode,
            longUrl,
            shortUrl,
        });

        await newUrlRecord.save();
        res.status(201).json({urlCode: generatedCode});

    } catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({error: "Failed to shorten URL"});
    }
});

module.exports = router;