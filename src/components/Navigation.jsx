import React from 'react'
import { Link } from 'react-router-dom'

const Navigation = () =>
  <div>
    <h1>React Data Analysis Demo</h1>  
    <div className="links">
      <Link to="/">Home</Link>
      <Link to="/events/hourly">Events Hourly</Link>
      <Link to="/events/daily">Events Daily</Link>
      <Link to="/stats/hourly">Stats Hourly</Link>
      <Link to="/stats/daily">Stats Daily</Link>
    </div>
  </div>

export default Navigation
