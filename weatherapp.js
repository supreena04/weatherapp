// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const https = require('https');

// Create an Express app
const app = express();

// Use bodyParser middleware for parsing URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(__dirname + "/public"));

// Use JSON parsing middleware
app.use(express.json());

// Define route for main page
app.get("/city/:cityName", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Define route for handling form submission
app.post("/", function (request, response) {
  let city = request.body.city;

  // Create options for HTTP request
  const options = {
    method: 'GET',
    hostname: 'openweather43.p.rapidapi.com',
    port: null,
    path: `/weather?q=${city}&appid=da0f9c8d90bde7e619c3ec47766a42f4&units=standard`,
    headers: {
      'X-RapidAPI-Key': '1bdd189b27msh739a10132e181aap1242e7jsne80927a28f25',
      'X-RapidAPI-Host': 'openweather43.p.rapidapi.com'
    }
  };

  // Make the HTTP request
  const req = https.request(options, function (res) {
    const chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function () {
      const body = Buffer.concat(chunks);

      // Parse the JSON response
      const weatherData = JSON.parse(body.toString());
      console.log(weatherData);

      // Extract relevant data
      const cityName = weatherData.name;
      const temperature = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const icon = weatherData.weather[0].icon;
      const weatherDesc = weatherData.weather[0].description;

      // Create HTML response
      const html = `
        <html>
          <head>
            <title>${cityName} Weather Data</title>
            <link rel="stylesheet" href="/styles.css">
          </head>
          <body>
            <div class="container">
              <h1>Weather Data for ${cityName}</h1>
              <p>Temperature: <span class="temp">${temperature} degrees Fahrenheit. </span> 

                <br> Humidity: <span class="humidity">${humidity}</span>
              </p>
              <p>
              There is <span class = "description">${weatherDesc}</span>
              <p>
                <img src="http://openweathermap.org/img/w/${icon}.png" alt="${weatherDesc}">
              </p>
            </div>
            <style>
            body {
              background-color: #ffec80; /* Light Yellow */
              font-family: 'Comic Sans MS', cursive, sans-serif; /* Playful font */
            }
            
            .container {
              background-color: rgba(255, 255, 255, 0.8);
              border-radius: 10px;
              box-shadow: 0px 0px 10px #666; /* Slightly darker shadow */
              margin: 50px auto;
              max-width: 600px;
              padding: 20px;
              text-align: center;
            }
            
            h1 {
              color: #00aaff; /* Bright Blue */
              font-size: 3em;
              font-weight: bold;
              text-shadow: 0px 0px 5px #000;
            }
            
            p {
              color: #ff3d67; /* Coral Pink */
              font-size: 1.5em;
              line-height: 1.5;
              margin-top: 30px;
            }
            
            span.temp {
              color: #ff3d67; /* Coral Pink */
              font-weight: bold;
            }
            
            span.humidity {
              color: #00aaff; /* Bright Blue */
              font-weight: bold;
            }
            
            span.description {
              color: #ff9f00; /* Orange */
              font-weight: bold;
            }
            
            img {
              display: block;
              margin: 0 auto;
              max-width: 100%;
              animation: bounce 1s infinite;
            }
            
            @keyframes bounce {
              0% {
                transform: translateY(0);
              }
            
              50% {
                transform: translateY(-10px);
              }
            
              100% {
                transform: translateY(0);
              }
            }
            
            </style>
          </body>
        </html>
      `;

      // Send the HTML response
      response.send(html); 
    });
  });

  // Handle errors in the HTTP request
  req.on("error", (error) => {
    console.error(error);
  });

  // End the request
  req.end();
});

// Define the port for the server
let port = process.env.PORT || 8002;

// Start the server
app.listen(port, function() {
  console.log ("Server running on port 8002");
});
