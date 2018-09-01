var express = require('express')
var bodyParser = require('body-parser')
var app = express();
var path = require('path')

//Set up port for heroku
var PORT = process.env.PORT || 8080;

//Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//grab the characters json file
var characters = require('./app/data/characters.js')
// console.log(characters)

//main html route index
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/app/public/home.html"))
});

app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "/app/public/survey.html"))
})

//Grabs my image file
app.get("/images/001fgo.jpg", function (req, res) {
    res.sendFile(path.join(__dirname, "/app/assets/images/001fgo.jpg"))
})

app.get("/images/saber.jpeg", function (req, res) {
    res.sendFile(path.join(__dirname, "/app/assets/images/saber.jpeg"))
})

app.post("/result", function (req, res) {
    var response = req.body
    var characterScore = []
    var totalScores = []

    console.log(`The req body is: ${JSON.stringify(response)}`)

    for (var i = 0; i < characters.length; i++) {
        console.log(`${characters[i].name}'s scores are: `)
        for (var j = 0; j < characters[0].scores.length; j++) {
            console.log(`${characters[i].scores[j]} Minus user's scores are ${response.score[j]}`)
            var total = Math.abs(characters[i].scores[j] - parseInt(response.score[j]))
            console.log(total)
            characterScore.push(total)
            // subtract 
            console.log(`response is a string: ${typeof (response.score[j])}`)
        }
        console.log(characterScore)
        // sum all values in the array
        var sum = characterScore.reduce(function (add, currentValue) {
            return add + currentValue;
        })
        console.log(`sum of ${characters[i].name} is ${sum}`)

        //push to total score array
        totalScores.push(sum)
        //clear for next character's use
        characterScore = []
    }
    console.log(`This is the total scores: ${totalScores}`)
    // Find the lowest score with the index
    //Return the index with lowest score
    function getLowestIndex(array) {
        var low = array[0];
        var lowIndex = 0;

        for (i = 1; i < array.length; i++) { // start with index 1, because you need to
            // check against the last known smallest value
            if (array[i] < low) {
                low = array[i];
                lowIndex = i;
            } //IF ANY REASON THEY HAVE THE SAME SCORE JUST COIN FLIP IT AND MOVE ON
            else if (array[i] === low) {
                //if true, let the next array index be the lowest
                if (coinFlip()) {
                    low = array[i];
                    lowIndex = i;

                    function coinFlip() {
                        return (Math.floor(Math.random() * 2) == 0);
                    }
                } else {
                    // else keep the old array index
                    continue
                }
            }

        }
        console.log(low)
        return lowIndex;
    }

    var selectedChar = getLowestIndex(totalScores)

    // send character data to client

    console.log(`You are this index: ${selectedChar} which is ${characters[selectedChar].name}`)

    res.send(characters[selectedChar])

})


//main json routes

//listener
app.listen(PORT, function () {
    console.log(`Listening on port: ${PORT}`)
})
