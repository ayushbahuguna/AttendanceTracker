const express = require('express');

const port = process.env.PORT || 3000;
var app = express();

app.use(express.static('public'));
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
  res.render('index', {title: 'Index', body: 'Hello from HandleBars!'});
});

app.listen(port, () => {
  console.log(`Started server on ${port}`);
});
