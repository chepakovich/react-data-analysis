import React from 'react'
import ReactDOM from 'react-dom'
import config from '../config'
import EventsRow from './EventsRow'
import EventsDailyApi from '../api/EventsDailyApi'
import Pagination from 'react-js-pagination'
import ChartDaily from '../components/EventsDailyChart.jsx'

export default class EventsTable extends React.Component {
  constructor() {
    super()
    this.state = {
      eventsData: [],
      activePage: 1,
      limit: config.limitEventsDaily,
      totalRows: 0
    };
    this.getDailyEvents(true);
  }

  CallEvents(withRowCount) {
    this.getDailyEvents(withRowCount);
  }

  getDailyEvents(withRowCount) {
    EventsDailyApi.getDailyEvents(withRowCount, this.state.activePage, this.state.limit)
      .then(dailyEvents => {
        if (dailyEvents.rowCount) {
          this.setState({ totalRows: dailyEvents.rowCount });
        }
        this.setState({ eventsData: dailyEvents.data });
      })
  }

  handlePageChange(pageNumber) {
    this.setState({
      activePage: pageNumber
    }, () => {this.CallEvents(false)})
  }

  render() {
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
        <ChartDaily data={eventsData} />
        <div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
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
    );
  }
}
