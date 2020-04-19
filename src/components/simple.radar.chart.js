import React from 'react';
import {Radar} from 'react-chartjs-2';
import {observer} from 'mobx-react';
import withSizes from 'react-sizes'

import query from '../store/query.store';

const color = 'rgba(38, 109, 211, 0.5)'

const mapSizesToProps = ({ width }) => ({
    isMobile: width < 960,
  })

  const SimpleRadarChart = observer(({isMobile}) => {  
      const { sales, costs, tradefees, rebates, freight, overhead, commissions } = query.item_data
      const [state] = React.useState({
        labels: ["Mfg. Cost", "Trade Discounts", "Rebates", "Freight", "Overhead", "Commissions", "Gross Profit"],
        datasets: [
            {
                label: 'Breakdown of Sale',
                backgroundColor: color,
                borderColor: color,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: color,
                data: [
                    costs, 
                    tradefees, 
                    rebates, 
                    freight, 
                    overhead, 
                    commissions, 
                    (sales - costs - tradefees - rebates - freight - overhead - commissions)
                ]
            },
        ]
      })

      return (
        <div>
            <Radar 
            data={state}
            options={{
                legend:{
                    display: false
                },
                maintainAspectRatio: false,
                scale: {
                    ticks: {
                        callback: function() {return ""},
                        backdropColor: "rgba(0, 0, 0, 0)"
                    }
                },
                scales:{                    
                    yAxes: [{
                        display: false
                    }]
                }
            }}
            width={isMobile ? 300 : 600}
            height={isMobile ? 400 : 550}
          />
        </div>
      )
  })

  export default withSizes(mapSizesToProps)(SimpleRadarChart)