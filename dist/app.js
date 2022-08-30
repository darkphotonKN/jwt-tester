"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("./helpers");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
// middlewares
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});
app.use((0, cors_1.default)({
    origin: ['http://localhost:3002'],
}));
app.use(express_1.default.json()); // middleware to parse incoming json
app.post('/api/auth', (req, res) => {
    console.log('request:', req);
    const { body } = req;
    console.log('body:', body);
    const { username, password } = body || {};
    if (username === 'test' && password === 'test123') {
        res.status(200).json({
            accessToken: (0, helpers_1.testToken)(10, true),
            refreshToken: 'refreshToken',
            roles: [2001, 5150],
        });
    }
    else {
        res.status(403).json({ msg: 'Login failed, please check credentials.' });
    }
});
// generate test refresh token that gives the correct testing accessToken
app.get('/api/refresh', (req, res) => {
    const { body } = req;
    const refreshToken = req.get('Authorization');
    console.log('current inc req:', req);
    console.log('current inc req authorization:', req.get('Authorization'));
    // check if fake refreshToken passes internal fake rule
    if (refreshToken === 'refreshToken') {
        // return new fake token
        return res.status(200).json({
            accessToken: Math.ceil(Math.random() * 10),
            refreshToken: 'refreshToken',
        });
    }
    else
        return res.status(403).json({ msg: 'Refresh token is invalid.' });
});
// get some fake users
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.get('Authorization');
    console.log('token:', token);
    const checkToken = (0, helpers_1.testToken)(10);
    const tokenResult = typeof checkToken === 'object' &&
        token &&
        checkToken.includes(parseInt(token));
    console.log('checking token match:', tokenResult, '\ncheckToken:', checkToken, '\napi token:', token);
    if (tokenResult) {
        const { data } = yield axios_1.default.get('https://jsonplaceholder.typicode.com/users');
        return res.json(data);
    }
    return res.status(403).json({
        msg: 'You do not have the correct permission to access this content.',
    });
}));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
