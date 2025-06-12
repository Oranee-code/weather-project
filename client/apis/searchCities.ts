// client/apis/searchCities.ts
import axios from 'axios'

export type CityResult = {
  name: string
  country: string
  latitude: number
  longitude: number
  timezone: string
}

export async function searchCities(query: string): Promise<CityResult[]> {
  const res = await axios.get(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5`
  )
  return res.data.results || []
}