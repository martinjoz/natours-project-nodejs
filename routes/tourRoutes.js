const express = require('express');
const router = express.Router();

const tourController = require('./../controllers/tourController');

router.param('id', (req, res, next, val) => {
  console.log(val);
  next();
});

router
  .route('/') //This will be treated as /api/v1/tours
  .get(tourController.getTours)
  .post(tourController.createTour);

router
  .route('/:id') //This will be treated as /api/v1/tours/:id
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
