const mongoose = require("mongoose");

module.exports = mongoose.model("Club", new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    tag: { type: String },
    logo: { type: String, default: "https://i.ibb.co/wC0jNYv/pngwing-com.png" },
    leader: { type: String },
    elo: { type: Number, default: 1000 },
    members: [],
    password: { type: String },
    registeredAt: { type: Number, default: Date.now() }
}));