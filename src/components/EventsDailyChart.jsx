import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries} from 'react-vis'

const ChartDaily= (props) => {
    const dataArr = props.data.map((d)=> {
        let date = new Date(d.date)
        let displDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        return {x: displDate, y: parseFloat(d.events)}
    })  
    return (
        <XYPlot
            xType="ordinal"
            width={1000}
            height={500}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title="Date" />
            <YAxis title="Events" />
                <LineSeries
                    data={dataArr}
                    style={{stroke: 'violet', strokeWidth: 3}}/>
        </XYPlot>
    )
}

export default ChartDaily