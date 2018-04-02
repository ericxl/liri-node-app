require("dotenv").config();
let keys = require('./key');
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require('request-promise');
let fs = require('fs-extra');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

if (process.argv[2] === "do-what-it-says") {
    var result = fs.readFileSync('./random.txt').toString('utf8').split(',');
    if (result[0]) {
        process.argv[2] = result[0];
    }
    if (result[1]) {
        process.argv[3] = result[1];
    }
}

if (process.argv[2] === "my-tweets") {
    var params = {
        count: 20,
        screen_name: 'Trump'
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            return console.log(error);
        }

        let output = "";
        tweets.forEach(t => {
            // Extract date information
            [, month, day, time, , year] = t.created_at.split(" ");
            [hour, minute] = time.split(":").map(x => parseInt(x, 10));

            // Format the time stamp
            const timeStamp = `${month} ${day} ${year}, ${hour % 12}:${minute} ${(hour < 12) ? "AM" : "PM"}`;

            output += `@${t.user.screen_name} · ${timeStamp}\n"${t.text}"\n\n`;
        });
        console.log(output);
    });
    
} else if (process.argv[2] === "movie-this") {
    var movieName = process.argv[3];
    if (!movieName) movieName = 'Mr. Nobody';
    request.get('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName)
        .then((data, err) => {
            if (err) {
                return console.log(err);
            }
            var response = JSON.parse(data);
            if (response) {
                if (response.Title) console.log(`* ${response.Title}`);
                if (response.Year) console.log(`* ${response.Year}`);
                if (response.Ratings && response.Ratings[0]) console.log(`* ${response.Ratings[0].Value}`);
                if (response.Ratings && response.Ratings[1]) console.log(`* ${response.Ratings[1].Value}`);
                if (response.Country) console.log(`* ${response.Country}`);
                if (response.Language) console.log(`* ${response.Language}`);
                if (response.Plot) console.log(`* ${response.Plot}`);
                if (response.Actors) console.log(`* ${response.Actors}`);
            }
        });
}