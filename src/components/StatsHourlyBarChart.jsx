import React from 'react'
import {
    XYPlot, XAxis, YAxis,
    VerticalGridLines, HorizontalGridLines,
    VerticalBarSeries, VerticalBarSeriesCanvas
} from 'react-vis'

const ChartHourly = (props) => {
    let impressions = []
    let clicks = []
    let revenue = []
    props.data.forEach(
        function(e){
            if(!impressions[e.hour]) {impressions[e.hour] = 0}
            if(!clicks[e.hour]) {clicks[e.hour] = 0}
            if(!revenue[e.hour]) {revenue[e.hour] = 0}
            impressions[e.hour] += e.impressions
            clicks[e.hour] += e.clicks
            revenue[e.hour] += e.revenue
        }
    )
    
    for(let i=0; i<24; ++i) {
        if(!impressions[i]) {impressions[i] = 0}
        if(!clicks[i]) {clicks[i] = 0}
        if(!revenue[i]) {revenue[i] = 0}
    }

    const dataArrImpressions = impressions.map((v,i)=> {return {x: i, y: parseFloat(v)}})
    const dataArrClicks = clicks.map((v,i)=> {return {x: i, y: parseFloat(v)}})
    const dataArrRevenue = revenue.map((v,i)=> {return {x: i, y: parseFloat(v)}})

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
                    data={dataArrRevenue} />
            </XYPlot>
    )
}

export default ChartHourly
