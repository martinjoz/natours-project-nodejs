const fs = require('fs');
const express = require('express');
const morgan = require('morgan')

const app = express();

const tourRouter = require('./../routes/tourRoutes');
const userRouter = require('./../routes/userRoutes');

/////////////////////////////////////////////Middleware /////////////////////////
//// 3rd Party middleware
app.use(morgan('dev')); //Used to log request in terminal eg Get, Post and url used and time it took
app.use(express.json()); //Acts as middleware to help access the req property in POST request
/////////My own middleware
app.use((req, res, next) => {
    console.log("Hello from middleware");
    next();
})

///////////////////////////////////////////////Defining functions to be used in routes ////////////////////////////

//Controller for Users
const getUsers = (req, res) => {
    res.status(500).json({ status: 'error', message: 'Route undefined' })
}
const getUser = (req, res) => {
    res.status(500).json({ status: 'error', message: 'Route undefined' })
}
const updateUser = (req, res) => {
    res.status(500).json({ status: 'error', message: 'Route undefined' })
}
const createUser = (req, res) => {
    res.status(500).json({ status: 'error', message: 'Route undefined' })
}
const deleteUser = (req, res) => {
        res.status(500).json({ status: 'error', message: 'Route undefined' })
    }
    // Older way of Defining Routes
    // app.get('/api/v1/tours', getTours);
    // app.post('/api/v1/tours', createTour);
    // app.get('/api/v1/tours/:id', getTour);
    // app.patch('/api/v1/tours/:id', updateTour)
    // app.delete('/api/v1/tours/:id', deleteTour);

//Newer way of defining routes by grouping them 
// app.route('/api/v1/tours')
//     .get(getTours)
//     .post(createTour);

// app.route('/api/v1/tours/:id')
//     .get(getTour)
//     .patch(updateTour)
//     .delete(deleteTour);


//////////////////////////////////////////// Newer way of defining routes ////////////////////////////////////////////
const tourRouter = express.Router();
const userRouter = express.Router();
//////commented code is what i was using before refractoring
// tourRouter
//     .route('/') //This will be treated as /api/v1/tours
//     .get(getTours)
//     .post(createTour);

// tourRouter.route('/:id') //This will be treated as /api/v1/tours/:id
//     .get(getTour)
//     .patch(updateTour)
//     .delete(deleteTour);

// userRouter.route('/') //This will be treated as /api/v1/users
//     .get(getUsers)
//     .post(createUser);

// userRouter.route('/:id')
//     .get(getUser)
//     .patch(updateUser)
//     .delete(deleteUser);

//mounting the router
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

////////////////// Start Server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});