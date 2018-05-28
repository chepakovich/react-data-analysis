import React from 'react'
import ReactDOM from 'react-dom'
import config from '../config'
import StatsRow from './StatsRow'
import StatsHourlyApi from '../api/StatsHourlyApi'
import Pagination from 'react-js-pagination'
import ChartHourly from '../components/StatsHourlyBarChart.jsx'
import Geo from '../components/StatsGeo.jsx'

export default class StatsTable extends React.Component {

  constructor() {
    super();
    this.state = {
      poiData: [],
      statsData: [],
      activePage: 1,
      limit: config.limitStatsHourly,
      totalRows: 0
    }
    this.getPoi(true)
    this.getHourlyStats(true);
  }

  getPoi() {
    fetch(config.apiUrl + '/poi')
      .then(response => response.json())
      .then(data => this.setState({ poiData: data }))
  }

  CallStats(withRowCount) {
    this.getHourlyStats(withRowCount);
  }

  getHourlyStats(withRowCount) {
    StatsHourlyApi.getHourlyStats(withRowCount, this.state.activePage, this.state.limit)
      .then(hourlyStats => {
        if (hourlyStats.rowCount) {
          this.setState({ totalRows: hourlyStats.rowCount })
        }
        this.setState({ statsData: hourlyStats.data })
      });
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber }, () => {
      this.CallStats(false)})
  }

  render() {
    const stateData = this.state
    const { statsData } = this.state
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
        <div className="cont2"><ChartHourly data={statsData} /></div>
        <div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th>Hour</th>
                <th>Impressions</th>
                <th>Click</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {
                statsData.map((result) => {
                  return <StatsRow record={result} />
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}