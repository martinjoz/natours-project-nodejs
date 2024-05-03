const Tour = require('./../models/tourModel');

//Error handling for all async function
const catchAsync = require('./../utils/catchAsync');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getTours = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).json({
    status: 'success',
    dataLength: tours.length,
    data: tours,
  });
  next();
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'Success',
    data: { tour },
  });
  next();
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { tour: newTour },
  });
  next();
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'Success',
    tour,
  });
  next();
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'Success',
    data: null,
  });
  next();
});
