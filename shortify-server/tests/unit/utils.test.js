const {generateShortId} = require("../../src/utils/utils");

describe("Utils - generateShortId", () => {
    const DEFAULT_LENGTH = 6;
    const CUSTOM_LENGTH = 10;
    const CUSTOM_ALPHABET = "ABC123";

    it("should generate a short ID of default length", () => {
        const shortId = generateShortId();
        expect(shortId).toHaveLength(DEFAULT_LENGTH);
    });

    it("should generate a short ID of specified custom length", () => {
        const shortId = generateShortId(CUSTOM_LENGTH);
        expect(shortId).toHaveLength(CUSTOM_LENGTH);
    });

    it("should generate a short ID containing only allowed characters", () => {
        const shortId = generateShortId(8, CUSTOM_ALPHABET);
        expect(shortId).toMatch(new RegExp(`^[${CUSTOM_ALPHABET}]+$`));
    });
});