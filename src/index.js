const express = require('express');
require('../src/db/mongoose'); // make sure mongoose is connected to the database
const auth = require('./middleware/auth');
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');
const app = express();

// Use the below line to parse JSON data

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled');
//     } else {
//         next();
//     }
// });

// app.use((req, res, next) => {
//     if (req.method) {
//         res.sendStatus(503);
//     } else {
//         next();
//     }
// });

app.get('/', (req, res) => {
    res.send('Welcome');
});
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is up on port ' + port);
});
const bcrypt = require('bcrypt');

// const hashPass = async () => {
//     const password = 'NesErtas';
//     const hashedPass = await bcrypt.hash(password, 10);
//     console.log(password);
//     console.log(hashedPass);
//     const result = await bcrypt.compare(password, hashedPass);
//     console.log(result);
// };

// hashPass();

const jwt = require('jsonwebtoken');

// const myFunc = async () => {
//     const token = jwt.sign({ _id: 'abc123' }, 'rabbiyessir', { expiresIn: '2 seconds' });
//     console.log(token);

//     const data = jwt.verify(token, 'rabbiyessir');
//     console.log(data);
// };
// myFunc();

const Task = require('./models/task');
const User = require('./models/user');
const main = async () => {
    // const task = await Task.findById('620ac961f7662d264438c3e2');
    // await task.populate('owner');
    // console.log(task.owner);
    // Get the  user and
    /* const user = await User.findById('620ac922f7662d264438c3c9');
    await user.populate(['tasks']);
    console.log(user.tasks); */
};

// main();
