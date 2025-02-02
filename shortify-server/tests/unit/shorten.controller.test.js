const request = require("supertest");
const express = require("express");
const shortenRouter = require("../../src/controllers/shorten.controller");
const {URLModel} = require("../../src/models/url.model");
const {generateShortId} = require("../../src/utils/utils");

jest.mock("../../src/utils/utils", () => ({
    generateShortId: jest.fn(() => "short123"),
}));

describe("Shorten Controller - Unit Tests", () => {
    let app;
    const TEST_LONG_URL = "http://example.com";
    const EXISTING_LONG_URL = "http://existing.com";
    const NEW_LONG_URL = "http://newurl.com";
    const CUSTOM_URL_CODE = "custom123";
    const EXISTING_URL_CODE = "exist123";
    const ERROR_URL = "http://error.com";

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use("/", shortenRouter);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return 400 for an invalid URL", async () => {
        const response = await request(app)
            .post("/shorten")
            .send({longUrl: "invalid-url"});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Invalid URL");
    });

    it("should return 400 if a custom urlCode is already in use", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue({urlCode: CUSTOM_URL_CODE});

        const response = await request(app)
            .post("/shorten")
            .send({longUrl: TEST_LONG_URL, urlCode: CUSTOM_URL_CODE});

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(`Code '${CUSTOM_URL_CODE}' is already in use. Please choose a different one.`);
    });

    it("should return an existing short code if the long URL already exists", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue({urlCode: EXISTING_URL_CODE});

        const response = await request(app)
            .post("/shorten")
            .send({longUrl: EXISTING_LONG_URL});

        expect(response.status).toBe(200);
        expect(response.body.urlCode).toBe(EXISTING_URL_CODE);
    });

    it("should create a new short URL", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue(null);
        jest.spyOn(URLModel.prototype, "save").mockResolvedValue();

        const response = await request(app)
            .post("/shorten")
            .send({longUrl: NEW_LONG_URL});

        expect(response.status).toBe(201);
        expect(response.body.urlCode).toBe("short123");
    });

    it("should return 500 if an error occurs during processing", async () => {
        jest.spyOn(URLModel, "findOne").mockRejectedValue(new Error("DB error"));

        const response = await request(app)
            .post("/shorten")
            .send({longUrl: ERROR_URL});

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to shorten URL");
    });
});