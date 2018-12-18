//vars
require('dotenv').config();
var keys = require("./keys.js");
console.log(keys)
var fs = require("fs");
var request = require("request");
var axios = require("axios");

//var Spotify = require('spotify-web-api-node');
var Spotify = require('node-spotify-api');
//creates log.txt file
var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

// Fetch Spotify Keys
var spotify = new Spotify(keys.spotify);
console.log(keys.spotify)

// Writes to the log.txt file
var getArtistNames = function (artist) {
    return artist.name;
};

// Function for running a Spotify search - Command is spotify-this-song
var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "What's my age again";
    }

    spotify.search(
        {
            type: "track",
            query: userCommand
        },
        function (err, data) {
            if (err) {
                console.log("Error occurred: " + err);
                return;
            }

            var songs = data.tracks.items;

            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistNames));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

//Switch command
function mySwitch(userCommand) {

    //choose which statement (userCommand) to switch to and execute
    switch (userCommand) {

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }

    axios.get(queryUrl)
    .then(function(response){

      console.log(response.data[0].venue.name);
      console.log(response.data[0].datetime)
      
      for(i=0; i<response.length; i++){
        console.log(response.data[i].datetime);
      }

    })

    //OMDB Movie - command: movie-this
    function getMovie() {
        // OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
        var movieName = secondCommand;
        // Then run a request to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);

                //Simultaneously output to console and log.txt via NPM simple-node-logger
                logOutput('================ Movie Info ================');
                logOutput("Title: " + body.Title);
                logOutput("Release Year: " + body.Year);
                logOutput("IMdB Rating: " + body.imdbRating);
                logOutput("Country: " + body.Country);
                logOutput("Language: " + body.Language);
                logOutput("Plot: " + body.Plot);
                logOutput("Actors: " + body.Actors);
                logOutput("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
                logOutput("Rotten Tomatoes URL: " + body.tomatoURL);
                logOutput('==================THE END=================');

            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }

    //Function for command do-what-it-says; reads and splits random.txt file
    //command: do-what-it-says
    function doWhat() {
        //Read random.txt file
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error);
            console.log(data.toString());
            //split text with comma delimiter
            var cmds = data.toString().split(',');
        });
    }



}   //Closes mySwitch func - Everything except the call must be within this scope

//Call mySwitch function
mySwitch(userCommand);
//Lets and var to get codes for LIRI
let axios = require('axios');
//Spotify = require('spotify-web-api-node');
let spotifyThis = require('node-spotify-api');
let moment = require('moment');
require('dotenv').config();
let keys = require('./keys.js');
var spotify = new spotifyThis(keys.spotify);
let inq = require('inquirer');
var fs = require('fs');

var command = process.argv[2];
//Switch functions for deployments
function run(command) {
    //OMDB deployment functions and instructions
    switch (command) {
        case 'movie-this':
            inq.prompt([
                {
                    type: "input",
                    message: "Enter the movie name",
                    name: "movie"
                }
            ]).then(function (movie) {
                omdbThisMovie(movie.movie);
            }); break;
        // Spotify deployment functions and instructions
        case 'spotify-this-song':
            inq.prompt([
                {
                    type: "input",
                    message: "Enter the song name",
                    name: "song"
                }
            ]).then(function (song) {
                SpotifyThisFunc(song.song);
            }); break;
        //Band in town deployment functions and instructions 
        case 'concert-this':
            inq.prompt([
                {
                    type: "input",
                    message: "Enter the band name",
                    name: "band"
                }
            ]).then(function (band) {
                bandInTownFunc(band.band);
            });

            break;
        case "do-what-it-says":
            justDoSomething();
            break;
    }
}
function bandInTownFunc(band) {
    if (band.includes(' ')) {
        band = band.replace(' ', '%20');
    }
    axios.get(`http://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`).then(
        function (response) {
            response.data.forEach(data => {
                (data.venue.name);
                console.log(data.venue.city + ', ' + data.venue.country);
                console.log(moment(data.datetime, 'YYYY-MM-DDTHH:mm').utc().format("MM/DD/YYYY"));
                //print to text file
                fs.appendFile('band.txt',
                    "Event Name: " + data.venue.name + '\n' +
                    "Event Location: " + data.venue.city + ', ' + data.venue.country + '\n' +
                    "Event Date: " + moment(data.datetime, 'YYYY-MM-DDTHH:mm').utc().format("MM/DD/YYYY") + '\n' +
                    "==========================" + '\n', function (error) { if (error) console.log(error) }
                );

            });
        }
    );
}
function SpotifyThisFunc(song) {
    if (song.includes(' ')) {
        song = song.replace(' ', '%20');
    }
    spotify.search({ type: 'track', query: song }, function (error, response) {
        if (error) {
            return console.log(error);
        }
        response.tracks.items.forEach(song => {
            console.log("Artist: " + song.artists[0].name);
            console.log("Song Name: " + song.name);
            console.log("Preview Link: " + song.preview_url);
            console.log("The Song Album: " + song.album.name);
            //print to text file
            fs.appendFile('song.txt',
                "Artist: " + song.artists[0].name + '\n' +
                "Song Name: " + song.name + '\n' +
                "Preview Link: " + song.preview_url + '\n' +
                "The Song Album: " + song.album.name + '\n' +
                "==========================" + '\n',
                function (error) { if (error) console.log(error) }
            );
        });
    });
}
function omdbThisMovie(movieName) {
    if (movieName.includes(' ')) {
        movieName = movieName.replace(' ', '%20');
    }
    let queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`;
    axios.get(queryUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMdB Rating: " + response.data.imdbRating);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            //print to text file
            fs.appendFile('movie.txt',
                "Title: " + response.data.Title + '\n' +
                "Release Year: " + response.data.Year + '\n' +
                "IMdB Rating: " + response.data.imdbRating + '\n' +
                "Country: " + response.data.Country + '\n' +
                "Language: " + response.data.Language + '\n' +
                "Plot: " + response.data.Plot + '\n' +
                "Actors: " + response.data.Actors + '\n' +
                "==========================" + '\n', function (error) { if (error) console.log(error) });
        }
    );
    