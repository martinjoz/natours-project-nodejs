const router = express.Router();

const express = require('express')

const userController = require('./../controllers/userController')

router.route('/') //This will be treated as /api/v1/users
    .get(userController.getUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;