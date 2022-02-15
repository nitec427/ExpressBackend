const { hash } = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = new mongoose.Schema(
    {
        description: { type: String, required: true, trim: true },
        completed: { type: Boolean, required: false, default: false },
        owner: {
            type: mongoose.Schema.Types.ObjectId /* Specific user */,
            required: true,
            ref: 'User',
        },
        password: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
    }
);
taskSchema.pre('save', async function () {
    const task = this;
    if (task.isModified('password')) {
        task.password = await hash(task.password, 10);
    }
});
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
