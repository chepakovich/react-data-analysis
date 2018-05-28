import React from 'react'
import ReactDOM from 'react-dom'
import StatsRow from './StatsRow'
import StatsDailyApi from '../api/StatsDailyApi'
import Pagination from 'react-js-pagination'
import ChartDaily from '../components/StatsDailyChart.jsx'

export default class StatsTable extends React.Component {

  constructor() {
    super();
    this.state = {
      statsData: [],
      selectedTime: 'daily',
      activePage: 1,
      limit: 15,
      totalRows: 0
    };
    this.getDailyStats(true);
  }

  onTimeChangeStats(value) {
    this.setState(
      {
        selectedTime: value,
        activePage: 1
      }, () => {
        this.CallStats(true);
      });
  }

  CallStats(withRowCount) {
    this.getDailyStats(withRowCount);
  }

  getDailyStats(withRowCount) {
    StatsDailyApi.getDailyStats(withRowCount, this.state.activePage, this.state.limit)
      .then(dailyStats => {
        if (dailyStats.rowCount) {
          this.setState({ totalRows: dailyStats.rowCount }, () => console.log(this.state.totalRows));
        }
        this.setState({ statsData: dailyStats.data }, () => console.log(this.state.totalRows));
      });
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({ activePage: pageNumber }, () => {
      this.CallStats(false);
    });
  }

  render() {
    let data = this.state.statsData
    return (
      <div>
         <div className="pagination-elements">
          <Pagination
            activePage={this.state.activePage}
            itemsCountPerPage={this.state.limit}
            totalItemsCount={this.state.totalRows}
            pageRangeDisplayed={5}
            onChange={this.handlePageChange.bind(this)}
          />
        </div>
        <ChartDaily data={data} />
        <div>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Date</th>
                <th className="color1"> Impressions</th>
                <th className="color2">Clicks</th>
                <th className="color3">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {
                data.map((result) => {
                  return <StatsRow record={result} />
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}