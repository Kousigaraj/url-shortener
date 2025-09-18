import mongoose from "mongoose";

const clickSchema = new mongoose.Schema({
    time: {
        type: String,
        required: true
    },
    referrer: {
        type: String,
        default: "Direct"
    }
});

const urlSchema = new mongoose.Schema({
    code:{
        type: String,
        required: true,
        unique: true
    },
    original:{
        type: String,
        required: true
    },
    created: {
        type: Number,
        default: Date.now,
        required: true
    },
    expiry:{
        type: Number,
        required: true
    },
    clicks:{
        type: [clickSchema],
        default: []
    }
});

const urls = mongoose.model.urls || mongoose.model('urls', urlSchema);

export default urls;