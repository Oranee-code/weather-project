// client/components/weather.tsx
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Weather() {
  const { isAuthenticated, logout, user } = useAuth0()
  const [city, setCity] = useState('Wellington')
  const [temperature, setTemperature] = useState<number | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeather(city)
    }
  }, [city, isAuthenticated])

  async function fetchWeather(city: string) {
    try {
      setError('')
      // Fetch coordinates from the geocoding API
      const geoRes = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      )
      const location = geoRes.data.results?.[0]
      if (!location) {
        setError('City not found.')
        setTemperature(null)
        return
      }
      const { latitude, longitude, name } = location

      //  Fetch weather using coordinates
      const weatherRes = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      )
      setTemperature(weatherRes.data.current_weather.temperature)
      setCity(name) 
    } catch (err) {
      setError('Error fetching weather data.')
      setTemperature(null)
    }
  }

  if (!isAuthenticated) return <p>You must be logged in to view this page.</p>

  return (
    <div>
      <h2>Hello, {user?.name}</h2>
      <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log out
      </button>

      <div>
        <h3>Search City:</h3>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={() => fetchWeather(city)}>Get Weather</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {temperature !== null && <p>Current temperature in {city}: {temperature}°C</p>}
    </div>
  )
}

export default Weather

//
