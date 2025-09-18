import urls from "../models/urlModel.js";

export const getUrls = async(req, res) => {
    try {
        const url = await urls.find({});
        res.status(200).json({ success: true, data: url})
    } catch (error) {
        console.error('Error in fetching urls: ', error.message)
        res.status(500).json({ success: false, message: 'Server Error'});
    }
};

export const getUrl = async(req, res) => {
    try {
        const { code } = req.params;
        const url = await urls.findOne({ code });

        if(!url){
            return res.status(404).json({ success: false, message: 'URL not found'});
        }

        res.status(200).json({ success: true, data: url});

    } catch (error) {
        console.error('Error in fetching url: ', error.message)
        res.status(500).json({ success: false, message: 'Server Error'});
    }
};

export const createUrls = async(req, res) => {
    try {
        const { code, original, created, expiry } = req.body;
        if(!code || !original || !expiry){
            return res.status(400).json({ success: false, message: 'Please provide all details' });
        }

        const existing = await urls.findOne({ code });
        if (existing) {
            return res
                .status(400)
                .json({ success: false, message: "Short code already exists" });
        }

        const newUrl = new urls({
            code,
            original,
            created,
            expiry
        })

        await newUrl.save();
        res.status(200).json({success: true, data: newUrl});

    } catch (error) {
        console.error('Error in creating url: ', error.message)
        res.status(500).json({ success: false, message: 'Server Error'});
    }
};

export const logClick = async(req, res) => {
    try {
        const { code } = req.params;
        const { time, referrer } = req.body;

        if( !code || !time || !referrer) {
            return res.status(404).json({ success: false, message: 'Please provide all details'});
        }

        const url = await urls.findOneAndUpdate(
            { code },
            { $push: { clicks: { time, referrer } } },
            { new: true }
        );
        
        if(!url){
            return res.status(404).json({ success: false, message: 'URL not found'});
        }
        
        res.status(200).json({ success: true, data: url.clicks});
    } catch (error) {
        console.error('Error in logging clicks: ', error.message)
        res.status(500).json({ success: false, message: 'Server Error'});
    }
};

export const deleteUrl = async (req, res) => {
    try {
        const { code } = req.params;
        const url = await urls.deleteOne({code});
        if (url.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "URL not found" });
        }

        res.status(200).json({ success: true, message: "URL deleted", data: url});
    } catch (error) {
        console.error('Error in deleting url: ', error.message)
        res.status(500).json({ success: false, message: 'Server Error'});
    }
}