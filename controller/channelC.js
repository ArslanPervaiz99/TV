const Channel = require("../model/channelM");

// Show all channels from DB
exports.getChannelsPage = (req, res, next) => {
  Channel.find()
    .then((channels) => {
      res.render("channels", {
        channels,
        pageTitle: "Channels",
      });
    })
    .catch((err) => {
      console.error("Error fetching channels:", err);
      res.status(500).send("Server error");
    });
};

// Add this function to your channelC.js file
exports.getTestPlayer = (req, res) => {
  const channelId = req.params.id;
  Channel.findById(channelId)
    .then((channel) => {
      if (!channel) {
        return res.status(404).send("Channel not found");
      }
      res.render("test-player", { channel, pageTitle: "Test " + channel.name });
    })
    .catch((err) => {
      console.error("Error fetching channel:", err);
      res.status(500).send("Server error");
    });
};

// Show form to add new channel
exports.getAddChannelForm = (req, res) => {
  res.render("add-channel", {
    pageTitle: "Add Channel",
    errorMessage: null,
    oldInput: { name: "", embedCode: "", logoUrl: "" },
  });
};

// Handle form submission to add new channel
exports.postAddChannel = (req, res) => {
  const { name, embedCode: streamUrl } = req.body;
  console.log(req.body);

  const logoUrl = req.file.filename;
  const newChannel = new Channel({
    name,
    embedCode: streamUrl,
    logoUrl,
  });

  newChannel
    .save()
    .then(() => {
      res.redirect("/"); // Redirect to channel list page after saving
    })
    .catch((err) => {
      console.error("Error saving channel:", err);
      res.status(500).send("Server error");
    });
};

// Show play channel page by ID
exports.getPlayChannel = (req, res) => {
  const channelId = req.params.id;

  Channel.findById(channelId)
    .then((channel) => {
      if (!channel) {
        return res.status(404).send("Channel not found");
      }
      res.render("play-channel", { channel, pageTitle: channel.name });
    })
    .catch((err) => {
      console.error("Error fetching channel:", err);
      res.status(500).send("Server error");
    });
};
