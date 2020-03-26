import React from "react";
import { observer } from 'mobx-react'
import {
  Chart,
  Geom,
  Tooltip,
  Coord,
  Label,
} from "bizcharts";
import Store from "../store/store";

const SimplePieChart = observer(() => {
    var data;    

    switch (Store.period) {
        case "currentPeriod":
            data = Store.pieChartData[2]
            break
        case "oneYearPriorPeriod":
            data = Store.pieChartData[1]
            break
        case "twoYearPriorPeriod":
            data = Store.pieChartData[0]
            break
        default:
            break
    }        

    return (
            <Chart
                data={data}
                height={400}
                padding={[50,50,50,50]}
                forceFit
                onIntervalClick={ev => {
                    const data = ev.data;
                    if (data) {
                        const name = data._origin['name'];
                        console.log(name)
                    }
                }}
                >
                <Coord type="theta"/>
                <Tooltip showTitle={false} />
                <Geom
                    type="intervalStack"
                    position="value"
                    color="name"
                >
                    {/* <Label content="name" /> */}
                </Geom>
            </Chart>
        );
})

export default SimplePieChart;
