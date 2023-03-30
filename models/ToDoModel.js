const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    task: {
        type: String,
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


todoSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('ToDos', todoSchema);
