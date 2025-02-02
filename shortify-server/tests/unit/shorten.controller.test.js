const request = require("supertest");
const express = require("express");
const router = require("../../src/controllers/shorten.controller");
const {URLModel} = require("../../src/models/url.model");
const {generateShortId} = require("../../src/utils/utils");

jest.mock("../../src/utils/utils", () => ({
    generateShortId: jest.fn(() => "short123"),
}));

describe("Shorten Controller - Unit Tests", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use(express.json());
        app.use("/", router);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return 400 for an invalid URL", async () => {
        const res = await request(app)
            .post("/shorten")
            .send({longUrl: "invalid-url"});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Invalid URL");
    });

    it("should return 400 if a custom urlCode is already in use", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue({urlCode: "custom123"});

        const res = await request(app)
            .post("/shorten")
            .send({longUrl: "http://example.com", urlCode: "custom123"});

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Code 'custom123' is already in use. Please choose a different one.");
    });

    it("should return an existing short code if the long URL already exists", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue({urlCode: "exist123"});

        const res = await request(app)
            .post("/shorten")
            .send({longUrl: "http://existing.com"});

        expect(res.status).toBe(200);
        expect(res.body.urlCode).toBe("exist123");
    });

    it("should create a new short URL", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue(null);
        jest.spyOn(URLModel.prototype, "save").mockResolvedValue();

        const res = await request(app)
            .post("/shorten")
            .send({longUrl: "http://newurl.com"});

        expect(res.status).toBe(201);
        expect(res.body.urlCode).toBe("short123");
    });

    it("should return 500 if an error occurs during processing", async () => {
        jest.spyOn(URLModel, "findOne").mockRejectedValue(new Error("DB error"));

        const res = await request(app)
            .post("/shorten")
            .send({longUrl: "http://error.com"});

        expect(res.status).toBe(500);
        expect(res.body.error).toBe("Failed to shorten URL");
    });
});