const express = require('express');
var fetch = require("node-fetch");
var bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/', (req, res) => {
  res.send('YOUR EXPRESS BACKEND IS CONNECTED TO REACT' );
});


app.post("/data", function(req, res) {
  var inputdata = req.body.value;
  var jsondata;
  var resultArray = [];

  fetch("https://itunes.apple.com/search?media=music&term=" + inputdata)
    .then(res => res.json())
    .then(data => {
      jsondata = data.results;
      for (var i = 0; i < jsondata.length; i++) {
        var completearray;
        var artistName = jsondata[i].artistName;
        var trackName = jsondata[i].trackName;
        var primaryGenreName = jsondata[i].primaryGenreName;
        var date = jsondata[i].releaseDate.split("-");
        var releaseDate = date[0];
        var imgUrl = jsondata[i].artworkUrl100;
        completearray = [
          artistName,
          trackName,
          primaryGenreName,
          releaseDate,
          imgUrl
        ];
        resultArray.push(completearray);
      }
      res.json({ banddata: resultArray, bandd: jsondata });
    });
});