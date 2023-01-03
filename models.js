const mongoose = require('mongoose');
const { Schema } = mongoose;

const IssueTrackerSchema = new Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_on: Date,
    updated_on: Date,
    created_by: {type: String, required: true},
    assigned_to: String,
    open: Boolean,
    status_text: String
});

const Issue = mongoose.model("Issue", IssueTrackerSchema);

const ProjectSchema = new Schema({
    name: { type: String, required: true},
    issues: [IssueTrackerSchema],
});

const Project = mongoose.model("Project", ProjectSchema);

exports.Issue = Issue;
exports.Project = Project;