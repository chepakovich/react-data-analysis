import React, { Component } from "react"
import {
  ComposableMap, ZoomableGroup,
  Geographies, Geography,
  Markers, Marker
} from "react-simple-maps"
import { scaleLinear } from "d3-scale"
import request from "axios"

const wrapperStyles = {
  width: "45%",
  maxWidth: 980/1.2,
  margin: "0 auto",
}
const cityScale = scaleLinear()
  .domain([0,37843000])
  .range([1,25])

const BasicMap = (props) => {
  const { poiData } = props.stateData
  const { statsData } = props.stateData

  let pLen = poiData.length;
  let places = []
  for (let i = 0; i < pLen; i++) {
    places.push({
      name: poiData[i].name,
      coordinates: [poiData[i].lon, poiData[i].lat]
    })
  }

  let markers2 = []
  statsData.forEach(
    function(d){
        if(!markers2[d.poi_id]) {
          markers2[d.poi_id] = 0
        }
        markers2[d.poi_id] += parseFloat(d.revenue)
    }
  )

  let markers3 = []
  markers2.forEach(function (value, i) {
    {markers3[i-1] = { name: places[i-1].name, coordinates: places[i-1].coordinates, population: value*20000}}
  })
  let markers = JSON.parse(JSON.stringify(markers3))

  return (
    <div style={wrapperStyles} className="cont1">
      <ComposableMap
        projectionConfig={{ scale: 670 }}
        width={465}
        height={350}
        style={{
          width: "auto",
          height: "auto",
        }}
        >
        <ZoomableGroup center={[-98, 43]} disablePanning>
          <Geographies geography="../static/world-50m.json">
            {(geographies, projection) =>
              geographies.map((geography, i) =>
                geography.id !== "ATA" && (
                  <Geography
                    key={i}
                    geography={geography}
                    projection={projection}
                    style={{
                      default: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      hover: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                      pressed: {
                        fill: "#ECEFF1",
                        stroke: "#607D8B",
                        strokeWidth: 0.75,
                        outline: "none",
                      },
                    }}
                  />
            ))}
          </Geographies>
          <Markers>
            {
              markers.map((marker, i) => (
                <Marker key={i} marker={marker}>
                  <circle
                    cx={0}
                    cy={0}
                    r={cityScale(marker.population)}
                    fill="rgba(255,87,34,0.8)"
                    stroke="#607D8B"
                    strokeWidth="2"
                  />
                </Marker>
              ))
            }
          </Markers>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}

export default BasicMap
