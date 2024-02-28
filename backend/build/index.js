"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./utils/logger"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = 4000;
app.get('/ping', (_req, res) => {
    logger_1.default.info('someone pinged');
    res.send({ message: 'pong' });
});
app.listen(PORT, () => {
    logger_1.default.info(`Server running on port ${PORT}`);
});
