import React from 'react'
import ReactDOM from 'react-dom'

export default class StatsRow extends React.Component {
  render() {
    var record = this.props.record;
    var date = new Date(record.date);
    return (
      <tr>
        <td>{date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()}</td>
        {record.hour != undefined ? <td>{record.hour}</td> : null}
        <td>{record.impressions}</td>
        <td>{record.clicks}</td>
        <td>{record.revenue}</td>
      </tr>
    );
  }
}