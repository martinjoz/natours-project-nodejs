const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection succesfull'));

const app = require('./app');

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle all Unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('Name: ' + err.name, 'Message: ' + err.message);
  console.log('Unhandled rejection. Shutting down...💥');
  process.exit(1);
});
