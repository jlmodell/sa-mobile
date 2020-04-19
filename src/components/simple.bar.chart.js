import React from 'react';
import {HorizontalBar} from 'react-chartjs-2';
import {observer} from 'mobx-react';
import withSizes from 'react-sizes'

import {colors} from './colors'
import query from '../store/query.store';

const mapSizesToProps = ({ width }) => ({
    isMobile: width < 960,
  })

const SimpleBarChart = observer(({isMobile}) => {
    const [state] = React.useState({
        labels: query.qty_sold_per_month.map(i => {
            return i.month
        }),
        datasets: [
            {
                label: 'Month',
                backgroundColor: colors,
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 1,
                data: query.qty_sold_per_month.map(i => {
                    return i.quantity
                })
            }
        ]
    })    

    return (
        <div>
            <HorizontalBar
                data={state}
                options={{
                    title: {
                        display: false,
                        text:'Sales By Month',
                        fontSize: 20
                    },
                    legend:{
                        display: false,
                        position: 'bottom'
                    },
                    maintainAspectRatio: false
                }}
                width={isMobile ? 300 : 600}
                height={isMobile ? 400 : 550}                
            />
        </div>
    )
})

export default withSizes(mapSizesToProps)(SimpleBarChart)