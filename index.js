const app = require('./app/app');

// Start the App
app.listen(process.env.PORT || 3000,() => {
  console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});