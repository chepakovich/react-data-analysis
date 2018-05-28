import React from 'react'
import ReactDOM from 'react-dom'
import config from '../config'
import EventsRow from './EventsRow'
import EventsHourlyApi from '../api/EventsHourlyApi'
import Pagination from 'react-js-pagination'
//import ChartHourly from '../components/EventsHourlyChart.jsx'
import ChartHourly from '../components/EventsHourlyBarChart.jsx'
import Geo from '../components/EventsGeo.jsx'

export default class EventsTable extends React.Component {
  constructor() {
    super()
    this.state = {
      poiData: [],
      eventsData: [],
      activePage: 1,
      limit: config.limitEventsHourly,
      totalRows: 0
    }
    this.getPoi(true)
    this.getHourlyEvents(true)
  }

  getPoi() {
    fetch(config.apiUrl + '/poi')
      .then(response => response.json())
      .then(data => this.setState({ poiData: data }))
  }

  CallEvents(withRowCount) {
    this.getHourlyEvents(withRowCount)
  }

  getHourlyEvents(withRowCount) {
    EventsHourlyApi.getHourlyEvents(withRowCount, this.state.activePage, this.state.limit)
      .then(hourlyEvents => {
        if (hourlyEvents.rowCount) {
          this.setState({ totalRows: hourlyEvents.rowCount })
        }
        this.setState({ eventsData: hourlyEvents.data })
      })
  }

  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber
    }, () => {this.CallEvents(false)})
  }

  render() {
    const stateData = this.state
    const { eventsData } = this.state
    return (
      <div>
        <div className="pagination">
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.state.limit}
            totalItemsCount={this.state.totalRows}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
          />
        </div>
        <div className="clear"></div>
        <div className="cont1"><Geo stateData={stateData} /></div>
        <div className="cont2"><ChartHourly data={eventsData} /></div>
        <div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hour</th>
                <th>Events</th>
              </tr>
            </thead>
            <tbody>
              {
                eventsData.map((result) => {
                  return <EventsRow record={result} />
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}