const request = require("supertest");
const express = require("express");
const redirectRouter = require("../../src/controllers/redirect.controller");
const {URLModel} = require("../../src/models/url.model");

describe("Redirect Controller - Unit Tests", () => {
    let app;
    const TEST_LONG_URL = "http://example.com";
    const EXISTING_SHORT_CODE = "abc123";
    const NON_EXISTENT_SHORT_CODE = "notfound";
    const ERROR_SHORT_CODE = "error";

    beforeAll(() => {
        app = express();
        app.use("/", redirectRouter);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should redirect to the long URL when a valid short code exists", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue({longUrl: TEST_LONG_URL});

        const response = await request(app).get(`/${EXISTING_SHORT_CODE}`);

        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(TEST_LONG_URL);
    });

    it("should return 404 if the short code does not exist", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue(null);

        const response = await request(app).get(`/${NON_EXISTENT_SHORT_CODE}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("URL not found");
    });

    it("should return 500 if a database error occurs", async () => {
        jest.spyOn(URLModel, "findOne").mockRejectedValue(new Error("DB error"));

        const response = await request(app).get(`/${ERROR_SHORT_CODE}`);

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal Server Error");
    });
});