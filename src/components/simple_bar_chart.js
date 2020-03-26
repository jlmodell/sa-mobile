import React from 'react'
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Legend,
  } from "bizcharts";

const SimpleBarChart = ({data, colorMap}) => (  	    
    <Chart height={400} data={data} padding={[50,50,50,50]} forceFit>                   
        <Axis name="value" label={{formatter: val => `${val/1000}k`}} />
        {/* <Legend position="bottom" /> */}
        <Tooltip />
        <Geom
            type="interval"
            position="period*value"
            color={[
                "period",
                (period) => colorMap[period]                    
            ]}
            tooltip={[
                "period*value",
                (period, value) => ({
                    name: period,
                    value: value
                })
            ]}
        />            
    </Chart>    
);


export default SimpleBarChart;