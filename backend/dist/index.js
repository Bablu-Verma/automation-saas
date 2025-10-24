"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app_ = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./router/route"));
const OAuth2_1 = __importDefault(require("./lib/OAuth2"));
(0, db_1.default)();
exports.app_ = (0, express_1.default)();
exports.app_.use("/images", express_1.default.static("images"));
exports.app_.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
exports.app_.use(express_1.default.json());
exports.app_.get('/', (req, res) => {
    res.send('Hello server');
});
// Routes
exports.app_.use('/api', route_1.default);
exports.app_.use(OAuth2_1.default);
// import './lib/OAuth2';
const PORT = process.env.PORT || 5000;
exports.app_.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
