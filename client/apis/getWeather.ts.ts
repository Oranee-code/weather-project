// client/apis/getWeather.ts
import axios from 'axios'

export async function getWeatherByCity(city: string) {
  const geoRes = await axios.get(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
  )

  const location = geoRes.data.results?.[0]
  if (!location) throw new Error('City not found')

  const { latitude, longitude, timezone, name } = location

  const weatherRes = await axios.get(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,windspeed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,weathercode&timezone=${timezone}`
  )

  const current = weatherRes.data.current_weather
  const hourly = weatherRes.data.hourly
  const daily = weatherRes.data.daily

  const descriptionMap: Record<number, string> = {
    0: 'Clear',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Drizzle: Light',
    53: 'Drizzle: Moderate',
    55: 'Drizzle: Dense',
    61: 'Rain: Slight',
    63: 'Rain: Moderate',
    65: 'Rain: Heavy',
    80: 'Rain showers',
    95: 'Thunderstorm',
  }

  return {
    city: name,
    temperature: current.temperature,
    windSpeed: current.windspeed,
    timezone,
    description: descriptionMap[current.weathercode] || 'Unknown',
    hourly,
    daily,
  }
}