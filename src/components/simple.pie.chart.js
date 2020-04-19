import React from 'react';
import {Doughnut} from 'react-chartjs-2';
import {observer} from 'mobx-react';
import withSizes from 'react-sizes'

import {colors} from './colors'
import query from '../store/query.store';

const mapSizesToProps = ({ width }) => ({
    isMobile: width < 960,
  })

const SimplePieChart = observer(({isMobile}) => {
    const [state] = React.useState({
        labels: query.customers_data.map(c => {
            return c._id.customer
        }),
        datasets: [
            {
                label: 'Quantity (cs)',
                backgroundColor: colors,
                hoverBackgroundColor: colors,
                data: query.customers_data.map(c => {
                        return c.quantity
                    })
            }
        ]
    })

    return (
        <div>
            <Doughnut
                data={state}
                options={{
                    title:{
                        display:false,
                        text:'Customers By Quantity Purchased',
                        fontSize:20
                    },
                    legend:{
                        display:false,
                        position:'right'
                    },
                    maintainAspectRatio: false
                }}
                width={isMobile ? 300 : 600}
                height={isMobile ? 400 : 550}      
            />
        </div>
    )
})

export default withSizes(mapSizesToProps)(SimplePieChart)