import React from 'react'
import { Link } from 'react-router-dom'
//import Layout from '../shared/Layout'

function Home (){
  return (
      <div>
        <h2>Home page</h2>
        <div className="clear"></div>
        <p>This is an example of data analysis and visualization using React with live feed from a PostgreSQL database.</p>
        <p>There are two sets of daily time series data and two sets of hourly time series data. The latter two also include locations.</p>
        <p>To simulate a production environment, rate limiting is set on API requests to events/daily: the maximum of 5 requests during the period of 10 seconds is allowed from a specific IP address.</p>
      </div>
  )
}

export default Home
