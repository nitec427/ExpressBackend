const Task = require('../models/task');
const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
    const new_task = new Task({
        ...req.body,
        // Bind the user and its task accordingly
        owner: req.user._id,
    });
    try {
        await new_task.save();
        res.status(201).send(new_task);
    } catch {
        res.status(404).send('Error creating new task');
    }
});
// router.post('/tasks/')
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    /* It is better to continue with empty object, when user add new query form that object yourself */
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    // console.log(req.query.completed);
    try {
        console.log(req.query.createdAt);
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort,
            },
        });
        res.send(req.user.tasks);
    } catch {
        res.status(500).send('Error fetching tasks');
    }
});
router.get('/tasks/:id', auth, async (req, res) => {
    /* If the user entered valid ID then do */
    const _id = req.params.id;

    try {
        console.log(req.user);
        const theTask = await Task.findOne({ _id, owner: req.user._id });
        console.log(theTask);
        if (!theTask) {
            res.status(404).send('No task was found');
        }
        res.send(theTask);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed', 'owner', 'password'];
    const isValidUpdate = keys.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        res.status(404).send('Invalid key is given');
    }
    const { body, params } = req;
    try {
        /* The id must belong the current user*/
        const task = await Task.findOne({ _id: params.id, owner: req.user._id });
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
router.delete('/tasks/:id', auth, async (req, res) => {
    // Delete the user by using its id
    const _id = req.params.id;
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send('No task found');
        }
        res.status(201).send('Task successfully deleted');
    } catch (err) {
        return res.status(400).send('Server error');
    }
});

module.exports = router;
