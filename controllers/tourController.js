const Tour = require('./../models/tourModel');

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.getTours = (req, res) => {
  //res.status(201).send('Hello From the server!');
  res.status(200).json({
    // status: 'success',
    // result: tours.length,
    // data: { tours },
  });
};

exports.getTour = (req, res) => {
  //   const id = req.params.id * 1;
  //   const tour = tours.find((el) => el.id === id);
  //   res.status(200).json({ status: 'success', data: tour });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { tour: newTour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid Data',
    });
  }
  //console.log(req.body)
  // res.send('Created Successfully'); //Must be return somn as send
  //   const newId = tours[tours.length - 1].id + 1; //Getting the last id so as to increment
  //   const newTour = Object.assign({ id: newId }, req.body); //Merging two objects
  //   tours.push(newTour);
  //   fs.writeFile(
  //     `${__dirname}/dev-data/data/tours-simple.json`,
  //     JSON.stringify(tours),
  //     (err) => {
  //       res.status(201).json({ status: 'success', data: tours });
  //     },
  //   );
  //res.status(200).json({ data: tours });
};

exports.updateTour = (req, res) => {
  //   if (req.params.id * 1 > tours.length) {
  //     return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  //   }
  //   res.status(200).send('Updated tour Here');
};

exports.deleteTour = (req, res) => {
  //   if (req.params.id * 1 > tours.length) {
  //     return res.status(404).json({ status: 'Fail', message: 'Invalid ID' });
  //   }
  //   res.status(204).json({ status: 'success', data: null });
};
