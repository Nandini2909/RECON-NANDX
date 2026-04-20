const mongoose = require('mongoose');

// Unified asset schema for Domains, Subdomains, IPs, URLs
const assetSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true,
    },
    type: {
        type: String, // 'domain', 'subdomain', 'ip', 'url'
        required: true,
    },
    value: {
        type: String,
        required: true,
        index: true, // index for quick exact matches
    },
    target: {
        type: String, // The initial target/domain this was found from
    },
    // Extracted Data specific to certain types
    isLive: {
        type: Boolean,
        default: null, // null if not yet probed
    },
    statusCode: {
        type: Number,
    },
    title: {
        type: String,
    },
    techStack: [String],
    ports: [{
        port: Number,
        service: String,
        version: String
    }],
    dnsRecords: {
        a: [String],
        aaaa: [String],
        mx: [String],
        cname: [String],
        ns: [String],
    },
    discoveredAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// To prevent duplicates like the same subdomain for the same org
assetSchema.index({ orgId: 1, type: 1, value: 1 }, { unique: true });

module.exports = mongoose.model('Asset', assetSchema);
