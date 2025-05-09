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
exports.getUserEmissions = exports.submitEmission = void 0;
// server/controllers/emissionsController.ts
//import Emission from "../models/Emission";
const Emission_1 = __importDefault(require("../models/Emission"));
const submitEmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fuel, electricity, waste } = req.body;
    const totalCO2e = fuel * 2.3 + electricity * 0.7 + waste * 1.5;
    try {
        const record = yield Emission_1.default.create({
            userId: req.user.userId,
            fuel,
            electricity,
            waste,
            totalCO2e,
        });
        res.status(201).json(record);
    }
    catch (err) {
        const error = err;
        res.status(400).json({ error: error.message });
    }
});
exports.submitEmission = submitEmission;
const getUserEmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const records = yield Emission_1.default.find({ userId: req.user.userId });
        res.status(200).json(records);
    }
    catch (err) {
        const error = err;
        res.status(400).json({ error: error.message });
    }
});
exports.getUserEmissions = getUserEmissions;
