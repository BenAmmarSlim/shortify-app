const crypto = require('crypto');

const defaultAlphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const generateShortId = (length = 6, alphabet = defaultAlphabet) => {
    let shortId = '';
    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        const index = randomBytes[i] % alphabet.length;
        shortId += alphabet.charAt(index);
    }

    return shortId;
};

module.exports = {generateShortId};