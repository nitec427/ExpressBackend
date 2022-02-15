const User = require('../models/user');
const express = require('express');
const auth = require('../middleware/auth');
const router = new express.Router();
const multer = require('multer');
// Save the user with the request body

// Corresponds to create user in Postman

// Do not use authentication for login and sign up operations
router.post('/users/me', async (req, res) => {
    const new_user = new User(req.body);
    try {
        // console.log(new_user);
        await new_user.save();
        const token = await new_user.generateAuthToken();
        // We can use try catch block here to detect errors
        res.status(201).send({ new_user, token });
    } catch (err) {
        console.log('An error', err);
        res.status(404).send(err);
    }
});
const avatar = multer({
    limits: { fileSize: 1048576 },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Invalid file extension. Upload an image please'));
        }
        cb(undefined, true);
    },
});
router.post(
    '/users/me/avatar',
    auth,
    avatar.single('avatar'),
    async (req, res) => {
        req.user.avatar = req.file.buffer;
        await req.user.save();
        res.sendStatus(200);
    },
    (err, req, res, next) => {
        res.status(404).send({ error: err.message });
    }
);
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) throw new Error('No avatar detected');
        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});
router.delete(
    '/users/me/avatar',
    auth,
    async (req, res) => {
        req.user.avatar = undefined;
        await req.user.save();
        res.sendStatus(200);
    },
    (err, req, res, next) => {
        res.status(404).send({ error: err.message });
    }
);
/* Use auth middleware just with Sign Up and Log in */
router.post('/users/login', async (req, res) => {
    try {
        // Use object destructuring
        const user = await User.findbyCredentials(req.body);
        const token = await user.generateAuthToken();
        res.status(200);
        // user is an object which contains "password and tokens field"
        // const { _id, name, email, age } = user; // this was my solution for hiding private data, another solution is User.methods.toJSON

        res.send({ user, token });
    } catch (err) {
        res.sendStatus(404);
    }
});
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});
router.post('/users/logout', auth, async (req, res) => {
    // You are returning the logout token via request object

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (err) {
        res.sendStatus(500);
    }
});
router.post('/users/logoutall', auth, async (req, res) => {
    // Clear all the tokens for the given user
    try {
        req.user.tokens = [];
        console.log(req.user);
        await req.user.save();
        res.send();
    } catch (err) {
        res.sendStatus(404);
    }
});
router.get('/users/me', auth, async (req, res) => {
    console.log(req);
    try {
        res.status(201).send(req.user);
    } catch {
        res.status(500).send('Error fetching users');
    }
});
/* The code below is not necessary for our purposes because we use token method to verify the user */
// router.get('/users/:id', auth, async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             res.status(404).send('No user found with the given id');
//         }
//         res.send(user);
//     } catch {
//         res.status(500).send();
//     }
// });
// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body); // return the keys in the Object
//     const allowedUpdates = ['name', 'email', 'password', 'age'];
//     const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

//     if (!isValidUpdate) {
//         return res.status(404).send('Non-present key is provided');
//     }
//     let { id } = req.params;

//     try {
//         // Find by id and update does not work with pre or post hooks
//         const user = await User.findById(id);
//         updates.forEach((update) => (user[update] = req.body[update]));
//         await user.save();
//         if (!user) {
//             res.status(404).send('No user found with the given id');
//         }
//         res.status(201).send('User successfully updated');
//     } catch {
//         res.status(400).send('Please check your user ID');
//     }
// });
router.patch('/users/me', auth, async (req, res) => {
    // Get the user
    // Traverse the given JSON
    const intendedUpdates = Object.keys(req.body);
    const availableUpdates = ['name', 'email', 'password', 'age'];
    // Check whether given update is ok
    const isValid = intendedUpdates.every((update) => availableUpdates.includes(update));
    if (!isValid) {
        return res.sendStatus(404);
    }
    try {
        intendedUpdates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();
        res.status(200).send(req.user);
    } catch (e) {
        res.sendStatus(401);
    }
});
router.delete('/users/me', auth, async (req, res) => {
    // Delete the user by using its id
    try {
        // const the_user = await User.findByIdAndDelete(req.user._id);
        // if (!the_user) {
        //     return res.status(404).send('No user found');
        // }
        // res.status(201).send('User successfully deleted');
        await req.user.remove();
        res.send(req.user);
    } catch (err) {
        return res.status(400).send('Server error');
    }
});
// Updated by the code above. You may delete another user's data without providing the token. (Avoid such cases)
// router.delete('/users/:id', async (req, res) => {
//     // Delete the user by using its id
//     const id = req.params.id;
//     console.log(id);
//     try {
//         const the_user = await User.findByIdAndDelete(id);
//         if (!the_user) {
//             return res.status(404).send('No user found');
//         }
//         res.status(201).send('User successfully deleted');
//     } catch (err) {
//         return res.status(400).send('Server error');
//     }
// });
module.exports = router;
