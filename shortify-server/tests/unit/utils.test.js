const {generateShortId} = require("../../src/utils/utils");

describe("Utils - generateShortId", () => {
    it("should generate a short ID of default length 6", () => {
        const shortId = generateShortId();
        expect(shortId).toHaveLength(6);
    });

    it("should generate a short ID of custom length", () => {
        const shortId = generateShortId(10);
        expect(shortId).toHaveLength(10);
    });

    it("should only contain characters from the specified alphabet", () => {
        const customAlphabet = "ABC123";
        const shortId = generateShortId(8, customAlphabet);
        expect(shortId).toMatch(/^[ABC123]+$/);
    });
});