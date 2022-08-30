"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testToken = void 0;
// get allowed test token
const testToken = (range, generateToken) => {
    if (!generateToken) {
        return new Array(range).fill(0).map((item, index) => index + 1);
    }
    return Math.ceil(Math.random() * range);
};
exports.testToken = testToken;
