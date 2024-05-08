const express = require('express');
const router = express.Router();
const auth = require('./../controllers/auth/auth');
const userController = require('./../controllers/userController');

//Auth routes
router.post('/signup', auth.signup);
router.post('/login', auth.login);
router.post('/forgotPassword', auth.forgetPassword);
router.patch('/resetPassword/:token', auth.resetPassword);
router.patch('/updatePassword', auth.protect, auth.updatePassword);

//Routes for updating current user eg like their profile
router.patch('/updateProfile', auth.protect, userController.updateMyProfile);
router.delete('/deleteProfile', auth.protect, userController.deleteProfile);

// Routes to handle cruds for users done by people like admin
router
  .route('/') //This will be treated as /api/v1/users
  .get(userController.getUsers);
//.post(createUser);

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

// router.route('/:id')
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);

module.exports = router;
