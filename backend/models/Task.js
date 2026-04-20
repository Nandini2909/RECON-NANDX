const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    orgId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true,
    },
    name: {
        type: String,
        required: true, // E.g., 'Full Scan: example.com' or 'Subdomains: example.com'
    },
    target: {
        type: String,
        required: true,
    },
    modules: [{
        type: String, // 'subdomains', 'dns', 'ports', 'web', 'urls'
    }],
    status: {
        type: String,
        enum: ['Pending', 'Running', 'Completed', 'Failed'],
        default: 'Pending',
    },
    logs: [{
        timestamp: { type: Date, default: Date.now },
        message: String,
        level: { type: String, default: 'info' } // info, error, success
    }],
    startedAt: {
        type: Date,
    },
    finishedAt: {
        type: Date,
    }
});

module.exports = mongoose.model('Task', taskSchema);
