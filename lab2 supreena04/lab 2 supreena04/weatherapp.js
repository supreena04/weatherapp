const unirest = require("unirest");
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Set up body-parser middleware to parse POST request data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS and HTML)
app.use(express.static(__dirname + '/public'));

// Define the root route
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// Handle the POST request with weather information
app.post("/", function (request, response) {
    const city = request.body.city;

    // Check if the city name is empty and handle the error
    if (!city) {
        return response.status(400).send("City name cannot be empty");
    }

    // Make an API request to fetch weather data
   
    const req = unirest("GET", `https://openweather43.p.rapidapi.com/weather?q=${city}&appid=da0f9c8d90bde7e619c3ec47766a42f4&lang=en&units=imperial`);
    req.query({
        "q": city,
        "lang": "en",
        "units": "imperial"
    });

    // Set your API keys
    req.headers({
        "x-rapidapi-key": "YOUR_RAPIDAPI_KEY",
        "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
        "useQueryString": true
    });

    req.end(function (res) {
        if (res.error) {
            return response.status(500).send("Error fetching weather data");
        }

        // Parse the response and display weather information
        const weatherData = res.body;

        // You can format the weather information and send it as a JSON response or HTML
        response.json(weatherData);
    });
});

const port = process.env.PORT || 8002;
app.listen(port, function () {
    console.log("Server running on port " + port);
});
