import React from 'react'
import {
    XYPlot, XAxis, YAxis,
    VerticalGridLines, HorizontalGridLines,
    VerticalBarSeries, VerticalBarSeriesCanvas
} from 'react-vis'

const ChartHourly = (props) => {
    let hourly = []
    props.data.forEach(
        function(e){
            if(!hourly[e.hour]) {
                hourly[e.hour] = 0
            }
            hourly[e.hour] += e.events
        }
    )
    
    for(let i=0; i<24; ++i) {
        if(!hourly[i]) {
            hourly[i] = 0
        }
    }

    const dataArr = hourly.map((v,i)=> {
        return {x: i, y: parseFloat(v)}
    })  

    return (
            <XYPlot
                xType="ordinal"
                width={590}
                height={380}>
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis title="Hour" />
                <YAxis title="Events" />
                <VerticalBarSeries
                    data={dataArr} />
            </XYPlot>
    )
}

export default ChartHourly
