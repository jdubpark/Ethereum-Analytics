"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.avalancheProvider = void 0;
const ethers_1 = require("ethers");
const Avalanche_1 = require("../constants/Avalanche");
exports.avalancheProvider = new ethers_1.providers.JsonRpcProvider(Avalanche_1.AvalancheRPC);
