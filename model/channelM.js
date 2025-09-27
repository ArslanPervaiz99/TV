// backend/models/channelModel.js

const mongoose = require("mongoose");

// Channel ka structure define kar rahe hain
const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    embedCode: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt fields automatically add ho jayein
  }
);

const Channel = mongoose.model("Channel", channelSchema);

module.exports = Channel;
