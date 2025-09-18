import urls from "../models/urlModel.js";

async function generateUniqueCode(custom) {
  if (custom) {
    const exists = await urls.findOne({ code: custom });
    if (exists) throw new Error("Custom code already in use.");
    return custom;
  }

  let code, exists;
  do {
    code = Math.random().toString(36).substring(2, 7);
    exists = await urls.findOne({ code });
  } while (exists);

  return code;
}

// Get all URLs
export const getUrls = async (req, res) => {
  try {
    const urlList = await urls.find({});
    res.status(200).json({ success: true, data: urlList });
  } catch (error) {
    console.error("Error in fetching urls:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get a single URL
export const getUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await urls.findOne({ code });

    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }

    res.status(200).json({ success: true, data: url });
  } catch (error) {
    console.error("Error in fetching url:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new short URL
export const createUrls = async (req, res) => {
  try {
    const { original, custom, minutes } = req.body;

    if (!original || !minutes) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all details" });
    }

    if (custom) {
      const existing = await urls.findOne({ code: custom });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Custom code already in use" });
      }
    }

    const code = await generateUniqueCode(custom);
    const created = Date.now();
    const expiry = created + minutes * 60000;

    const newUrl = await urls.create({
      original,
      code,
      created,
      expiry,
      clicks: [],
    });

    res.status(201).json({ success: true, data: newUrl });
  } catch (error) {
    console.error("Error in creating url:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Log a click
export const logClick = async (req, res) => {
  try {
    const { code } = req.params;
    const time = new Date().toISOString();
    const referrer = req.get("Referrer") || "direct";

    const url = await urls.findOneAndUpdate(
      { code },
      { $push: { clicks: { time, referrer } } },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }

    res.status(200).json({ success: true, data: url.clicks });
  } catch (error) {
    console.error("Error in logging clicks:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a URL
export const deleteUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const result = await urls.deleteOne({ code });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "URL not found" });
    }

    res.status(200).json({ success: true, message: "URL deleted" });
  } catch (error) {
    console.error("Error in deleting url:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
