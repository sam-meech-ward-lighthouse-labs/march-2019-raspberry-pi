const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send("Apple pie is better");
});

app.listen(8080);