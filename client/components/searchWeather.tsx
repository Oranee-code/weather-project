import { useState } from 'react'
import { getWeatherByCity } from '../apis/getWeather.ts'

type WeatherData = {
  city: string
  temperature: number
  windSpeed: number
  timezone: string
  description: string
  hourly: {
    time: string[]
    temperature_2m: number[]
    windspeed_10m: number[]
    weathercode: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    windspeed_10m_max: number[]
    weathercode: number[]
  }
}

export default function SearchWeather() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')

  async function handleSearch() {
    try {
      setError('')
      const data = await getWeatherByCity(city)
      setWeather(data)
    } catch (err) {
      setError('City not found or error fetching weather.')
      setWeather(null)
    }
  }

  return (
    <div>
      <h2>Search Weather</h2>
      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Search Weather</button>

      {weather && (
        <div>
          <h3>{weather.city}</h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windSpeed} km/h</p>
          <p>Timezone: {weather.timezone}</p>
          <p>Conditions: {weather.description}</p>

          <h4>Hourly Forecast:</h4>
          <ul>
            {weather.hourly.time.slice(0, 6).map((time, index) => (
              <li key={time}>
                {new Date(time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                : {weather.hourly.temperature_2m[index]}°C, Wind: {weather.hourly.windspeed_10m[index]} km/h
              </li>
            ))}
          </ul>

          <h4>7-Day Forecast:</h4>
          <ul>
            {weather.daily.time.map((date, index) => (
              <li key={date}>
                <strong>
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </strong>
                :<br />
                🌡️ {weather.daily.temperature_2m_min[index]}°C - {weather.daily.temperature_2m_max[index]}°C |
                💨 Wind: {weather.daily.windspeed_10m_max[index]} km/h |
                ☁️ {weather.description}
              </li>
            ))}
          </ul>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}