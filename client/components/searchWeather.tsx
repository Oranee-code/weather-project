// client/components/seachWeather.tsx
import { useState, useEffect } from 'react'
import { searchCities, CityResult } from '../apis/searchCities'
import { getWeatherByCoords } from '../apis/getWeather.ts'

type WeatherData = {
  city: string
  country: string
  temperature: number
  windSpeed: number
  timezone: string
  description: string
  weathercode: number
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
// image condition 
const imageMap: Record<number, string> = {
  0: 'clear.png',
  1: 'mainly_clear.png',
  2: 'partly_cloudy.png',
  3: 'overcast.png',
  45: 'fog.png',
  48: 'rime_fog.png',
  51: 'drizzle_light.png',
  53: 'drizzle_moderate.png',
  55: 'drizzle_dense.png',
  61: 'rain_slight.png',
  63: 'rain_moderate.png',
  65: 'rain_heavy.png',
  80: 'rain_showers.png',
  95: 'thunderstorm.png',
}


export default function SearchWeather() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<CityResult[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query) {
      setSuggestions([])
      return
    }

    const timeout = setTimeout(async () => {
      try {
        const results = await searchCities(query)
        setSuggestions(results)
      } catch {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  async function handleSelectCity(city: CityResult) {
    setQuery(`${city.name}, ${city.country}`)
    setSuggestions([])
    setError('')
    try {
      const data = await getWeatherByCoords(city.latitude, city.longitude, city.timezone)
      setWeather({ ...data, city: city.name, country: city.country })
    } catch {
      setError('Error fetching weather.')
      setWeather(null)
    }
  }

  return (
    <div className="weather-container">
      <h1>🔎</h1>
      <input
        type="text"
        placeholder="Enter city"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '15px' }}
      />

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
            <li
              key={`${city.name}-${city.latitude}-${city.longitude}`}
              onClick={() => handleSelectCity(city)}
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-details">
          <h3>
            {weather.city}, {weather.country}
          </h3>
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windSpeed} km/h</p>
          <p>Timezone: {weather.timezone}</p>
          <p>Conditions: {weather.description}</p>

          {/* img for Conditions */}
          {weather.hourly.weathercode !== undefined && (
            <img
              src={`/images/${imageMap[weather.hourly.weathercode[0]]}`}
              alt={weather.description}
              className="weather-icon-large"
            />
          )}
          <h4>Hourly Forecast:</h4>
          <ul className="forecast-list">
            {weather.hourly.time.slice(0, 6).map((time, index) => (
              <li key={time}>
                {new Date(time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                : {weather.hourly.temperature_2m[index]}°C | Wind:{' '}
                {weather.hourly.windspeed_10m[index]} km/h
              </li>
            ))}
          </ul>

          <h4>7-Day Forecast:</h4>
          <ul className="forecast-list">
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
                {/* img for Conditions */}
                {weather.daily.weathercode !== undefined && (
                  <img
                    src={`/images/${imageMap[weather.daily.weathercode[index]] || 'overcast.png'}`}
                    alt={weather.description}
                    className="weather-icon-small"
                  />
                )}
                {weather.daily.temperature_2m_min[0]}°C -{' '}
                {weather.daily.temperature_2m_max[0]}°C | Wind:{' '}
                {weather.daily.windspeed_10m_max[0]} km/h |{' '}
                {weather.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}