import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navigation from './components/Navigation.jsx'
import Home from './components/Home.jsx'
import EventsHourly from './components/EventsHourly.jsx'
import EventsDaily from './components/EventsDaily.jsx'
import StatsHourly from './components/StatsHourly.jsx'
import StatsDaily from './components/StatsDaily.jsx'

ReactDOM.render(
  <Router>
    <div>
      <Navigation />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/events/hourly' component={EventsHourly} />
        <Route path='/events/daily' component={EventsDaily} />
        <Route path='/stats/hourly' component={StatsHourly} />
        <Route path='/stats/daily' component={StatsDaily} />
      </Switch>
    </div>
  </Router>,
  document.getElementById('app-root')
)
