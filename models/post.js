const mongoose = require('mongoose')

const postschema = mongoose.Schema(
    {
        id: {type: String, required: true},
        issueName: {type: String, required: true},
        description: {type: String, required: true},
        departments: {type: String, required: true}
    }
)

module.exports = mongoose.model('Post', postschema)