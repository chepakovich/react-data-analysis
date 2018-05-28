import React from 'react'
import ReactDOM from 'react-dom'

export default class EventsRow extends React.Component {
  render() {
    let record = this.props.record
    let date = new Date(record.date)
    let displDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    return (
      <tr>
        <td>{displDate}</td>
        {record.hour ? <td>{record.hour}</td> : null}
        <td>{record.events}</td>
      </tr>
    )
  }
}