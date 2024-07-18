const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const request = require("request");

const path = require("path");
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const city = req.body.city;

    var lat = "";
    var long = "";
    var timezone = "";
    var imgpath = "";

    if (city === "Tokyo") {
        lat = "35.682839";
        long = "139.759455";
        timezone = "Asia/Tokyo";
        imgpath = "/images/tokyo.jpg";
    }

    else if (city === "Berlin") {
        lat = "52.5200";
        long = "13.4050";
        timezone = "Europe/Berlin";
        imgpath = "/images/berlin.jpg";
    }

    else if (city === "Singapore") {
        lat = "1.3521";
        long = "103.8198";
        timezone = "Asia/Singapore";
        imgpath = "/images/singapore.jpg";
    }

    else if (city === "London") {
        lat = "51.5074";
        long = "0.1278";
        timezone = "Europe/London";
        imgpath = "/images/london.jpg";
    }

    else {
        lat = "55.7558";
        long = "37.6176";
        timezone = "Europe/Moscow";
        imgpath = "/images/moscow.jpg";
    }

    request(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=${timezone}`, function (error, response, body) {
        const data = JSON.parse(response.body);
        const currentdata = data.current;

        let display = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <link rel="stylesheet" href="/styles.css">
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Weather App</title>
        </head>
        <body>
            <div class="heading">
                <h1>Weather App</h1>
            </div>
            <div class="main">
                <div class="city">
                    <img src="${imgpath}" alt="${city}" />
                </div>
                <div class="data">
                    <h2>${city}</h2>
                    <ul>
                        <li><b>Temperature:</b> ${currentdata.temperature_2m}&degC</li>
                        <li><b>Humidity:</b> ${currentdata.relative_humidity_2m}%</li>
                        <li><b>Wind:</b> ${currentdata.wind_speed_10m} km/hr</li>
                    </ul>
                </div>
            </div>
        </body>
        </html>`;

        res.send(display);
    });
});

app.listen(3000, function (req, res) {
    console.log("http://localhost:3000");
});
