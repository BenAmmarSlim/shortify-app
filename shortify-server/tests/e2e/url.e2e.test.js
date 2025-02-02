require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../src/index");
const {URLModel} = require("../../src/models/url.model");

describe("URL Shortener API - End-to-End Tests", () => {
    const TEST_LONG_URL = "https://example.com";
    const CUSTOM_URL_CODE = "custom123";
    const EXISTING_URL_CODE = "exist123";
    const NON_EXISTENT_CODE = "nonexistent";
    const TAKEN_URL_CODE = "taken123";
    const ERROR_URL = "https://www.errorpage.com";

    beforeAll(async () => {
        if (!process.env.TEST_DB_URI) {
            throw new Error("TEST_DB_URI is missing! Please define it in the environment variables.");
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

    it("should create and store a new short URL", async () => {
        const response = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: TEST_LONG_URL});

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("urlCode");

        const storedUrl = await URLModel.findOne({urlCode: response.body.urlCode});
        expect(storedUrl).not.toBeNull();
        expect(storedUrl.longUrl).toBe(TEST_LONG_URL);
        expect(storedUrl.shortUrl).toContain(process.env.BASE_URI);
    });

    it("should create a short URL with a custom code", async () => {
        const response = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: TEST_LONG_URL, urlCode: CUSTOM_URL_CODE});

        expect(response.status).toBe(201);
        expect(response.body.urlCode).toBe(CUSTOM_URL_CODE);

        const storedUrl = await URLModel.findOne({urlCode: CUSTOM_URL_CODE});
        expect(storedUrl).not.toBeNull();
        expect(storedUrl.shortUrl).toContain(CUSTOM_URL_CODE);
        expect(storedUrl.longUrl).toBe(TEST_LONG_URL);
    });

    it("should return the existing short URL code if the long URL is already in the database", async () => {
        await new URLModel({
            urlCode: EXISTING_URL_CODE,
            longUrl: TEST_LONG_URL,
            shortUrl: `${process.env.BASE_URI}/${EXISTING_URL_CODE}`,
        }).save();

        const response = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: TEST_LONG_URL});

        expect(response.status).toBe(200);
        expect(response.body.urlCode).toBe(EXISTING_URL_CODE);

        const storedUrl = await URLModel.findOne({urlCode: EXISTING_URL_CODE});
        expect(storedUrl).not.toBeNull();
        expect(storedUrl.longUrl).toBe(TEST_LONG_URL);
    });

    it("should return 400 for an invalid URL", async () => {
        const response = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: "invalid-url"});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid URL");
    });

    it("should redirect to the original URL when given a valid short code", async () => {
        await new URLModel({
            urlCode: "test123",
            longUrl: TEST_LONG_URL,
            shortUrl: `${process.env.BASE_URI}/test123`,
        }).save();

        const response = await request(app).get("/test123");

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(TEST_LONG_URL);
    });

    it("should return 404 when a short code does not exist", async () => {
        const response = await request(app).get(`/${NON_EXISTENT_CODE}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("URL not found");
    });

    it("should return 400 if a custom short code is already in use", async () => {
        await new URLModel({
            urlCode: TAKEN_URL_CODE,
            longUrl: TEST_LONG_URL,
            shortUrl: `${process.env.BASE_URI}/${TAKEN_URL_CODE}`,
        }).save();

        const response = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: TEST_LONG_URL, urlCode: TAKEN_URL_CODE});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(`Code '${TAKEN_URL_CODE}' is already in use. Please choose a different one.`);
    });

    it("should return 500 when a database error occurs", async () => {
        jest.spyOn(URLModel, "findOne").mockRejectedValueOnce(new Error("DB error"));

        const response = await request(app)
            .post("/api/url/shorten")
            .send({longUrl: ERROR_URL});

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to shorten URL");
    });
});