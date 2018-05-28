import React from 'react'
import {XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineSeries} from 'react-vis'

const ChartDaily= (props) => {
    const dataArrImpressions = props.data.map((d)=> {
        let date = new Date(d.date)
        let displDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        return {x: displDate, y: parseFloat(d.impressions)/2764609*100}
    })  
    const dataArrClicks = props.data.map((d)=> {
        let date = new Date(d.date)
        let displDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        return {x: displDate, y: parseFloat(d.clicks)/3627*100}
    })
    const dataArrRevenue = props.data.map((d)=> {
        let date = new Date(d.date)
        let displDate = date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
        return {x: displDate, y: parseFloat(d.revenue)/13092.123479*100}
    })  
    return (
        <XYPlot
            xType="ordinal"
            width={1000}
            height={500}>
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis title="Date" />
            <YAxis title="Relative to 1-1-2017, %" />
            <LineSeries
                className="first-series"
                data={dataArrImpressions}
                style={{stroke: 'blue', strokeWidth: 3}}/>
            <LineSeries
                className="second-series"
                data={dataArrClicks}
                style={{stroke: 'violet', strokeWidth: 3}}/>
            <LineSeries
                className="third-series"
                data={dataArrRevenue}
                style={{stroke: 'green', strokeWidth: 3}}/>
        </XYPlot>
    )
}

export default ChartDaily
