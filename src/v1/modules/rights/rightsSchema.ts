const { ObjectId } = require('mongodb')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moduleSchema = new Schema({
    'name': {
        type: String,
        required: true
    },
    'status': {
        type: Number,
        required: true,
        default: 1,
    },
    'createdAt': {
        type: Date,
        required: true,
    },
    'updatedAt': {
        type: Date,
        required: true,
    }
});
const Modules = mongoose.model('modules', moduleSchema);

const rightsSchema = new Schema({
    'name': {
        type: String,
        required: true
    },
    'moduleID': {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "modules"
    },
    'slug': {
        type: String,
        trim: true,
        required: true
    },
    'status': {
        type: Number,
        trim: true
    },
    'createAt': {
        type: Date,
    },
    'updateAt': {
        type: Date,
    }
}, {
    timestamps: true,
    autoCreate: true,
})
const Rights = mongoose.model('rights', rightsSchema);

module.exports = {
    Modules: Modules,
    Rights: Rights
};


