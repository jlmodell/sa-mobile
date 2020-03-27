import React from 'react';
import { observer } from 'mobx-react'
// import {useHistory} from 'react-router-dom'

import Store from '../store/store'
import {validItem} from '../utilities/utilities'

import SimpleBarChart from '../components/simple_bar_chart'
import SimplePieChart from '../components/simple_pie_chart'
import SimpleDataTable from '../components/simple_data_table';

const Dashboard = observer(() => {
    // const history = useHistory()
    const [state, setState] = React.useState({
        valid: false,        
    })
    const itemRef = React.useRef(null);
    const endingPeriodRef = React.useRef(null);

    React.useEffect(() => {
		Store.token && itemRef.current.focus();
    }, []);
    
    React.useEffect(
        () => {
            if (validItem(Store.item)) {
                setState({
                    ...state,
                    valid: true
                });
                Store.gql_fetch_itemName();
            } else {
                setState({
                    ...state,
                    valid: false
                });
                Store.gql_fetch_itemName();
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ Store.item ]
    );    

    return (
        <div className="dashboard disable-scrollbars">        
            <section id="header">
                <nav className="nav grid">
                    <h1>Busse Hospital Disposables</h1>
                    <ul>
                        <li><a href="#options-selector">Data Selector</a></li>
                        <li><a href="#kpi">KPI</a></li>
                        <li><a href="#charts">Charting</a></li>
                        <li><a href="#table">Tables</a></li>
                    </ul>
                </nav>
            </section>
            <section id="options-selector">
                <div className="options-outer-container">
                    <div className="options-container">
                        <div className="options grid">
                            <input className={state.valid ? "options" : "options invalid"} ref={itemRef} name="item" type="text" value={Store.item} onChange={(e) => {
                                Store.item = e.target.value
                                localStorage.setItem('item', e.target.value);
                            }} />
                            <p className="options">{Store.itemName}</p>
                            <input className="options" ref={endingPeriodRef} name="endingPeriod" type="date" value={Store.endingPeriod} onChange={(e) => {
                                Store.endingPeriod = e.target.value
                                localStorage.setItem('endingPeriod', e.target.value);
                            }} />
                            <p className="options">{Store.twoYearPriorStartingPeriod} - {Store.endingPeriod}</p>
                            <button 
                                disabled={state.valid ? false : true} 
                                className={state.valid ? "options" : "options disabled"} 
                                onClick={async () => {
                                    await Store.gql_fetch_data()                                
                                }}
                            >
                                Refresh Data
                            </button>
                        </div>    
                    </div>                            
                </div>
            </section>

            {Store.isLoaded &&
                (
                    <>
                        <section id="kpi">
                            <div className="kpi-container grid">
                                <div className="kpi-avg-qty kpi-boxes">
                                    <h2>Average Qty:</h2>
                                    <p>{Store.avgQty.toFixed(0)}</p>
                                </div>
                                <div className="kpi-avg-sales kpi-boxes">
                                    <h2>Average Sales:</h2>
                                    <p>
                                        {Store.avgSales.toLocaleString('en', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}
                                    </p>
                                </div>
                                <div className="kpi-avg-costs kpi-boxes">
                                    <h2>Average Costs:</h2>
                                    <p>
                                        {Store.avgCosts.toLocaleString('en', {
                                            style: 'currency',
                                            currency: 'USD',
                                            minimumFractionDigits: 0,
                                            maximumFractionDigits: 0
                                        })}
                                    </p>
                                </div>
                            </div>
                        </section>                        
                        <section id="charts">
                            <div className="charts-container grid">
                                <div className="bar-chart-container">
                                    <div className="bar-chart-title"><h2>Sales Over Time</h2></div>
                                    <div className="bar-chart">
                                        <SimpleBarChart data={Store.barChartData} colorMap={Store.colorMap} />
                                    </div>
                                </div>                                                
                                <div className="pie-chart-container">
                                    <div className="pie-chart-title"><h2>Breakdown of Customers</h2></div>
                                    <div className="period-selector">
                                        <button className={Store.period === "twoYearPriorPeriod" ? "period-selector-active" : null} onClick={() => Store.period = "twoYearPriorPeriod"}>{Store.twoYearPriorEndingPeriod}</button>
                                        <button className={Store.period === "oneYearPriorPeriod" ? "period-selector-active" : null} onClick={() => Store.period = "oneYearPriorPeriod"}>{Store.oneYearPriorEndingPeriod}</button>
                                        <button className={Store.period === "currentPeriod" ? "period-selector-active" : null} onClick={() => Store.period = "currentPeriod"}>{Store.endingPeriod}</button>
                                    </div>
                                    <div className="pie-chart">                                    
                                        <SimplePieChart />
                                    </div>
                                </div>
                            </div>
                        </section>                        
                        <section id="table">
                            <div className="data-table-container grid">
                                <div className="data-table-title"><h2>Sales Details</h2></div>
                                <div className="period-selector">
                                    <button className={Store.period === "twoYearPriorPeriod" ? "period-selector-active" : null} onClick={() => Store.period = "twoYearPriorPeriod"}>{Store.twoYearPriorEndingPeriod}</button>
                                    <button className={Store.period === "oneYearPriorPeriod" ? "period-selector-active" : null} onClick={() => Store.period = "oneYearPriorPeriod"}>{Store.oneYearPriorEndingPeriod}</button>
                                    <button className={Store.period === "currentPeriod" ? "period-selector-active" : null} onClick={() => Store.period = "currentPeriod"}>{Store.endingPeriod}</button>
                                </div>
                                <div className="data-table">
                                    <SimpleDataTable />
                                </div>
                            </div>
                        </section>
                    </>
                )
        }
        </div>
    );
})

export default Dashboard;
