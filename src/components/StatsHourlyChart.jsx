import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, MarkSeries} from 'react-vis'

const ChartHourly = (props) => {
    let hourly = []
    props.data.forEach(
        function(e){
            if(!hourly[e.hour]) {
                hourly[e.hour] = 0
            }
            hourly[e.hour] += e.revenue
        }
    )

    const dataArr = hourly.map((v,i)=> {
        return {x: i, y: parseFloat(v)}
    })  

    return (
        <XYPlot
            xType="ordinal"
            width={1000}
            height={500}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title="Hour" />
            <YAxis title="Revenue" />
                <MarkSeries
                    data={dataArr}
                    style={{stroke: 'violet', strokeWidth: 3}}/>
        </XYPlot>
    )
}

export default ChartHourly
