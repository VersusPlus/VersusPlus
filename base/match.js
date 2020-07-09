const mongoose = require("mongoose");

module.exports = mongoose.model("Match", new mongoose.Schema({
    id: { type: String },
    mode: { type: String },
    players: [],
    slots: { type: Number },
    status: { type: String},
    hostname: { type: String },
    createdAt: { type: Number, default: Date.now() }
}));