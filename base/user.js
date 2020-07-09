const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
    id: { type: String }, // Discord ID of the user
    username: { type: String }, // Discord Nickname of the user
    kartrider: { type: String },
    elo: { type: Number, default: 1000 },
    club: { type: String, default: 'none'},
    registeredAt: { type: Number, default: Date.now() }
}));