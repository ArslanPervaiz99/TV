const express = require("express");
const channelController = require("../controller/channelC");

const ChannelRouter = express.Router();

ChannelRouter.get("/", channelController.getChannelsPage);
// Add this line to your channelR.js file
ChannelRouter.get("/test-player/:id", channelController.getTestPlayer);
ChannelRouter.get("/add-channel", channelController.getAddChannelForm);
ChannelRouter.post("/add-channel", channelController.postAddChannel);
ChannelRouter.get("/play/:id", channelController.getPlayChannel);

module.exports = ChannelRouter;
