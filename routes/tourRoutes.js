const express = require('express');
const router = express.Router();
const auth = require('./../controllers/auth/auth');

const tourController = require('./../controllers/tourController');

router.param('id', (req, res, next, val) => {
  console.log(val);
  next();
});

router
  .route('/') //This will be treated as /api/v1/tours
  .get(auth.protect, tourController.getTours)
  .post(tourController.createTour);

router
  .route('/:id') //This will be treated as /api/v1/tours/:id
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    auth.protect,
    auth.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

module.exports = router;
