const request = require("supertest");
const express = require("express");
const router = require("../../src/controllers/redirect.controller");
const {URLModel} = require("../../src/models/url.model");

describe("Redirect Controller - Unit Tests", () => {
    let app;

    beforeAll(() => {
        app = express();
        app.use("/", router);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should redirect to the longUrl when the record exists", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue({longUrl: "http://example.com"});

        const res = await request(app).get("/abc123");

        expect(res.status).toBe(302);
        expect(res.headers.location).toBe("http://example.com");
    });

    it("should return 404 if the short code does not exist", async () => {
        jest.spyOn(URLModel, "findOne").mockResolvedValue(null);

        const res = await request(app).get("/notfound");

        expect(res.status).toBe(404);
        expect(res.body.message).toBe("URL not found");
    });

    it("should return 500 if an error occurs", async () => {
        jest.spyOn(URLModel, "findOne").mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/error");

        expect(res.status).toBe(500);
        expect(res.body.message).toBe("Internal Server Error");
    });
});