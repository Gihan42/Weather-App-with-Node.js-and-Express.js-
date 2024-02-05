import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv"; 
import cors from "cors";
dotenv.config(); 

const app = express();
app.use(cors());
const port = process.env.PORT 

const OPENWEATHERMAP_API_KEY = process.env.KEY; ;


app.use(express.static("public"));

app.get('/weather', async (req, res) => { 
    const location = req.query.location;
    console.log(location);

      if (!location) {
        return res
          .status(400)
          .json({ error: "Missing location query parameter" });
      }
    
     const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
       location
     )}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
    
    try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    const weatherData = {
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    return res.json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
