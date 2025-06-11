/* eslint-disable react/jsx-key */


// client/routes.tsx
import { Route, createRoutesFromElements } from 'react-router'
import AppLayout from './components/App'
import Home from './components/logIn.tsx'
import Weather from './components/weather.tsx'

const routes = createRoutesFromElements(
  <Route path="/" element={<AppLayout />}>
  <Route index element={<Home />} />
  <Route path="weather" element={<Weather />} />
</Route>
)

export default routes