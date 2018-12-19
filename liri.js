// lets and vars to run and get api/s
let axios = require('axios');
let spotifyThis = require('node-spotify-api');
let moment = require('moment');
require('dotenv').config();
let keys = require('./keys.js');
var spotify = new spotifyThis(keys.spotify);
let inq = require('inquirer');
var fs = require('fs');
 
var command= process.argv[2];
// Switch functions run deployment
function run(command)
{
// If 'movie-this' deployed answer "message" asked
    switch(command){
        case 'movie-this':
        inq.prompt([
            {
                type:"input",
                message:"Enter the movie name",
                name:"movie"
            }
        ]).then(function(movie){
            omdbThisMovie(movie.movie);
        });break; //break loop
//If else switch statement to 'spotify-this-song'
        case 'spotify-this-song':
        inq.prompt([
            {
                type:"input",
                message:"Enter the song name",
                name:"song"
            }
        ]).then(function(song){
            SpotifyThisFunc(song.song);
        });break;//Break loop
//Switch statement 'concert-this' bands
        case 'concert-this':
        inq.prompt([
            {
                type:"input",
                message:"Enter the band name",
                name:"band"
            }
        ]).then(function(band){
            bandInTownFunc(band.band);
        });break;
        case "do-what-it-says":
            justDoSomething();
            break;
    }
}
function bandInTownFunc(band){
     if(band.includes(' ')){
        band = band.replace(' ','%20');
    }
    axios.get(`http://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`).then(
    function (response) {
        response.data.forEach(data =>{
            (data.venue.name);
            console.log(data.venue.city+', '+data.venue.country);
            console.log(moment(data.datetime, 'YYYY-MM-DDTHH:mm').utc().format("MM/DD/YYYY"));  
            //print to text file
            fs.appendFile('band.txt',
                "Event Name: " + data.venue.name+'\n'+
                "Event Location: " + data.venue.city+', '+data.venue.country+'\n'+
                "Event Date: " + moment(data.datetime, 'YYYY-MM-DDTHH:mm').utc().format("MM/DD/YYYY")+'\n'+
                "=========================="+'\n',function(error){if(error)console.log(error)}
            );
            
        });
      }
);
}
function SpotifyThisFunc(song){
    if(song.includes(' ')){
        song = song.replace(' ','%20');
    }
    spotify.search({ type: 'track', query: song}, function(error, response){
        if(error){
            return console.log(error);
        }
        response.tracks.items.forEach(song=>{
            console.log("Artist: "+song.artists[0].name);
            console.log("Song Name: "+song.name);
            console.log("Preview Link: "+song.preview_url);
            console.log("The Song Album: "+song.album.name);
            //print to text file
            fs.appendFile('song.txt',
                "Artist: "+song.artists[0].name+'\n'+
                "Song Name: "+song.name+'\n'+
                "Preview Link: "+song.preview_url+'\n'+
                "The Song Album: "+song.album.name+'\n'+
                "=========================="+'\n',
                function(error){if(error)console.log(error)}
            );
        });
      });
}
//omdb function to use database to find movie and print movie info to txt  
function omdbThisMovie(movieName){
    if(movieName.includes(' ')){
        movieName = movieName.replace(' ','%20');
    }
    let queryUrl = `http://www.omdbapi.com/?t=${movieName}&y=&plot=short&apikey=trilogy`;
    axios.get(queryUrl).then(
        function(response) {
            console.log("Title: " + response.data.Title);
            console.log("Release Year: " + response.data.Year);
            console.log("IMdB Rating: " + response.data.imdbRating);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            //print to text file
            fs.appendFile('movie.txt',
                "Title: " + response.data.Title+'\n'+
                "Release Year: " + response.data.Year+'\n'+
                "IMdB Rating: " + response.data.imdbRating+'\n'+
                "Country: " + response.data.Country+'\n'+
                "Language: " + response.data.Language+'\n'+
                "Plot: " + response.data.Plot+'\n'+
                "Actors: " + response.data.Actors+'\n'+
                "=========================="+'\n',function(error){if(error)console.log(error)});
        }
    );
}
//Callback function
function justDoSomething(){
    fs.readFile('random.txt', "utf8", function(error, data){
      var song = data.split(',');
  
      SpotifyThisFunc(song[1]);
    });
  }
  
  run(command);