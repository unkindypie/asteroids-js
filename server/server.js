const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../build')));

//т.к. я использую browser-routing, то мне необходимо отправлять один и тот же документ на все запросы
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => {
  console.log('Server is up on port', port);
});
