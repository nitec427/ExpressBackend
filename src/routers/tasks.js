const Task = require('../models/task');
const express = require('express');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
    const new_task = new Task(req.body);
    try {
        await new_task.save();
        res.status(201).send();
    } catch {
        res.status(404).send('Error creating new task');
    }
});
// router.post('/tasks/')
router.get('/tasks', async (req, res) => {
    try {
        const task_list = await Task.find({});
        res.send(task_list);
    } catch {
        res.status(500).send('Error fetching tasks');
    }
});
router.get('/tasks/:id', async (req, res) => {
    /* If the user entered valid ID then do */
    const _id = req.params.id;

    try {
        const theTask = await Task.findById(_id);
        if (!theTask) {
            res.status(404).send('No task was found');
        }
        res.send(theTask);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed', 'owner', 'password'];
    const isValidUpdate = keys.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        res.status(404).send('Invalid key is given');
    }
    const { body, params } = req;
    try {
        const task = await Task.findById(params.id);
        keys.forEach((update) => (task[update] = body[update]));
        await task.save();
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.status(201).send('Task successfully updated');
    } catch {
        return res.status(400).send('An error occurred while updating the task');
    }
});

router.delete('/tasks/:id', async (req, res) => {
    // Delete the user by using its id
    const id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).send('No task found');
        }
        res.status(201).send('Task successfully deleted');
    } catch (err) {
        return res.status(400).send('Server error');
    }
});

module.exports = router;
