const express = require('express');
//const cors = require('cors');

const port = process.env.PORT || 8080;
const app = express()

//app.use(cors());
//app.use(express.json());

app.use('/js',       express.static(__dirname + '/app/js'));
app.use('/lib',      express.static(__dirname + '/app/lib'));
app.use('/pages',    express.static(__dirname + '/app/pages'));
app.use('/css',      express.static(__dirname + '/app/css'));
app.use('/assets',   express.static(__dirname + '/app/assets'));

app.use('/app.js',   express.static(__dirname + '/app/app.js'));



app.use('/bin',      express.static(__dirname + '/bin'));
app.use('/dist',     express.static(__dirname + '/dist'));



app.get('/', function(req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
