require("dotenv").config({path: ".env.test"});
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/index");
const {URLModel} = require("../../src/models/url.model");

describe("URL Shortener API - E2E Tests", () => {
    beforeAll(async () => {
        if (!process.env.TEST_DB_URI) {
            throw new Error("TEST_DB_URI is missing in .env.test!");
        }
        await mongoose.connect(process.env.TEST_DB_URI);
    });

    afterEach(async () => {
        await URLModel.deleteMany();
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it("should create a new short URL and fetch it from the database", async () => {
        const longUrl = "https://example.com";
        const res = await request(app)
            .post("/api/url/shorten")
            .send({longUrl});

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("urlCode");

        const urlRecord = await URLModel.findOne({urlCode: res.body.urlCode});
        expect(urlRecord).not.toBeNull();
        expect(urlRecord.longUrl).toBe(longUrl);
        expect(urlRecord.shortUrl).toContain(process.env.BASE_URI);
    });

    it("should create a new short URL with a custom code and verify it in the database", async () => {
        const longUrl = "https://www.corporatesite.com/services";
        const customCode = "custom123";
        const res = await request(app)
            .post("/api/url/shorten")
            .send({longUrl, urlCode: customCode});

        expect(res.status).toBe(201);
        expect(res.body.urlCode).toBe(customCode);

        const urlRecord = await URLModel.findOne({urlCode: customCode});
        expect(urlRecord).not.toBeNull();
        expect(urlRecord.shortUrl).toContain(customCode);
        expect(urlRecord.longUrl).toBe(longUrl);
    });

    it("should return the existing short URL code if the long URL is already in the database", async () => {
        const longUrl = "https://www.enterprisecompany.com/contact";
        await new URLModel({
            urlCode: "exist123",
            longUrl,
            shortUrl: `${process.env.BASE_URI}/exist123`,
        }).save();

        const res = await request(app)
            .post("/api/url/shorten")
            .send({longUrl});

        expect(res.status).toBe(200);
        expect(res.body.urlCode).toBe("exist123");

        const urlRecord = await URLModel.findOne({urlCode: "exist123"});
        expect(urlRecord).not.toBeNull();
        expect(urlRecord.longUrl).toBe(longUrl);
    });

    it("should return 400 for an invalid URL", async () => {
        const res = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: "invalid-url"});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Invalid URL");
    });

    it("should redirect to the original URL when given a valid short code", async () => {
        const longUrl = "https://www.globaltech.com/blog";
        await new URLModel({
            urlCode: "test123",
            longUrl,
            shortUrl: `${process.env.BASE_URI}/test123`,
        }).save();

        const res = await request(app).get("/test123");

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe(longUrl);
    });

    it("should return 404 when a short code does not exist", async () => {
        const res = await request(app).get("/nonexistent");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("URL not found");
    });

    it("should return 400 if a custom short code is already in use", async () => {
        await new URLModel({
            urlCode: "taken123",
            longUrl: "https://www.businessnetwork.com/careers",
            shortUrl: `${process.env.BASE_URI}/taken123`,
        }).save();

        const res = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: "https://www.businessnetwork.com/careers", urlCode: "taken123"});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Code 'taken123' is already in use. Please choose a different one.");
    });

    it("should return 500 when a database error occurs", async () => {
        jest.spyOn(URLModel, "findOne").mockRejectedValueOnce(new Error("DB error"));

        const res = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: "https://www.errorpage.com"});

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Failed to shorten URL");
    });
});