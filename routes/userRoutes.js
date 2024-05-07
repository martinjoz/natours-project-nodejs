const express = require('express');
const router = express.Router();

const auth = require('./../controllers/auth/auth');

//Auth routes
router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/forgotPassword', auth.forgetPassword);
router.patch('/resetPassword/:token', auth.resetPassword);

// //Controller for Users
// const getUsers = (req, res) => {
//     res.status(500).json({ status: 'error', message: 'Route undefined' })
// }
// const getUser = (req, res) => {
//     res.status(500).json({ status: 'error', message: 'Route undefined' })
// }
// const updateUser = (req, res) => {
//     res.status(500).json({ status: 'error', message: 'Route undefined' })
// }
// const createUser = (req, res) => {
//     res.status(500).json({ status: 'error', message: 'Route undefined' })
// }
// const deleteUser = (req, res) => {
//     res.status(500).json({ status: 'error', message: 'Route undefined' })
// }

// router.route('/') //This will be treated as /api/v1/users
//     .get(getUsers)
//     .post(createUser);

// router.route('/:id')
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);

module.exports = router;
