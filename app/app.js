const express = require('express');
const app = express();
const {fees, computeTransactionFee} = require('./Controller');

app.use(express.json()); 
app.post('/fees', fees);
app.post('/compute-transaction-fee', computeTransactionFee);

app.use('*', (_, res) => {
  return res.status(404).json({Error: "Not Found"});
});

app.use((err, _, res, __) => {
  if (err) {
      console.log(err);
      if (err?.message?.startsWith("Unexpected number in JSON ")){
        return res.status(400).json({Error: "JSON not properly formatted, confirm one of the Number field in the payload not starting with zero. Possibly SixID."});
      }
     return res.status(500).json({Error: "Something went wrong"});
  }
});

module.exports = app;