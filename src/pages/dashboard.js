import React from 'react';
import { observer } from 'mobx-react'
import { dateHelper } from '../utilities/utilities'
import withSizes from 'react-sizes'
// import { useHistory } from 'react-router-dom'

import query from '../store/query.store'
import auth from '../store/auth.store'

import SimpleBarChart from '../components/simple.bar.chart'
import SimplePieChart from '../components/simple.pie.chart'
import SimpleDataTable from '../components/simple_data_table';
import SimpleRadarChart from '../components/simple.radar.chart';

const mapSizesToProps = ({ width }) => ({
    isMobile: width < 960,
  })

const Dashboard = observer(({isMobile}) => {
    // const history = useHistory()
    const [valid, isValid] = React.useState(false)
    const dates = `${dateHelper(query.start)} - ${dateHelper(query.end)}`
    const [item, setItem] = React.useState('')
    const [items, setItems] = React.useState([])
    const [active, setActive] = React.useState('')
    const itemRef = React.useRef(null);
    const startRef = React.useRef(null);

    React.useEffect(() => {
		auth.isAuth && itemRef.current.focus();
    }, []);

    const fetch = async (item) => {
        const res = await query.fetch_item_description(item)
        setItems(res)
    }

    const validItem = (items, item) => {
        return items.some(i => i.item_id === item)
    }
    
    React.useEffect(
        () => {            
            if (item.length > 2) {
                fetch(item)
            }           
        },
        [item]
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
                            <button 
                                    disabled={valid && query.start !== '' && query.end !== '' ? false : true} 
                                    className={valid && query.start !== '' && query.end !== '' ? "options" : "options disabled"} 
                                    onClick={() => {                                                         
                                        query.fetch_data()                                        
                                    }}
                                >
                                Refresh Data
                            </button>
                            <input className={valid ? "options" : "options invalid"} ref={itemRef} name="item" type="text" value={item} onChange={(e) => {
                                setItem(e.target.value)
                                localStorage.setItem('item', e.target.value);                                
                            }} />
                            <label className="options options-label" htmlFor="start">Start</label>
                            <input className="options" ref={startRef} name="start" type="date" value={query.start} onChange={(e) => {
                                query.start = e.target.value
                                localStorage.setItem('start', e.target.value);
                            }} />
                            <label className="options options-label" htmlFor="end">End</label>
                            <input className="options" name="end" type="date" value={query.end} onChange={(e) => {
                                query.end = e.target.value
                                localStorage.setItem('end', e.target.value);
                            }} />                                                                               
                        </div>

                        {items && <div className="options-container-list">
                            <ul>                                
                                {items.map((item,index) => (
                                    <li 
                                        key={index} 
                                        className={active === item.item_id ? "options-container-li-active" : "options-container-li"}
                                        onClick={() => {
                                            setActive(item.item_id)
                                            setItem(item.item_id)
                                            if (validItem(items, item.item_id)) isValid(true)
                                            setItems(items.filter(i => item.item_id === i.item_id))                                                                           
                                            query.item = item.item_id
                                        }}
                                    >
                                        <span className="options-container-li-iid">[{item.item_id}]</span> {item.item_description}
                                    </li>
                                ))}
                            </ul>     
                        </div>}

                    </div>                    

                    <div className={query.dataIsLoaded && !isMobile ? "scrolldown" : ""}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
            </section>

            {query.noSales &&
                <div className="sub-title">
                    <h2>No sales were found during {dates}.</h2>
                </div>
            }

            {(!query.isLoading && query.dataIsLoaded) && !query.noSales &&
                (
                    <>
                        <section id="kpi">
                            <div className="kpi-outer-container">
                                <div className="sub-title"><p>{dates}</p></div>
                                <div className="kpi-container grid">
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Quantity Sold:</h2>
                                        <p>{query.item_data.quantity.toFixed(0)}</p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Sales:</h2>
                                        <p>
                                            {query.item_data.sales.toLocaleString('en', {
                                                style: 'currency',
                                                currency: 'USD',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Costs:</h2>
                                        <p>
                                            {query.item_data.costs.toLocaleString('en', {
                                                style: 'currency',
                                                currency: 'USD',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </p>
                                        <p>
                                            {query.item_data.sales !== 0 ? ((query.item_data.costs / query.item_data.sales) * 100).toFixed(2) : "N/A"}% of Sales
                                        </p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Discounts:</h2>
                                        <p>
                                            {query.item_data.tradefees.toLocaleString('en', {
                                                style: 'currency',
                                                currency: 'USD',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </p>
                                        <p>
                                            {query.item_data.sales !== 0 ? ((query.item_data.tradefees / query.item_data.sales) * 100).toFixed(2) : "N/A"}% of Sales
                                        </p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Rebates:</h2>
                                        <p>
                                            {query.item_data.rebates.toLocaleString('en', {
                                                style: 'currency',
                                                currency: 'USD',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </p>
                                        <p>
                                            {query.item_data.sales !== 0 ? ((query.item_data.rebates / query.item_data.sales) * 100).toFixed(2) : "N/A"}% of Sales
                                        </p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Freight & Overhead:</h2>
                                        <p>
                                            {(query.item_data.freight + query.item_data.overhead).toLocaleString('en', {
                                                style: 'currency',
                                                currency: 'USD',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0
                                            })}
                                        </p>
                                        <p>
                                            {query.item_data.sales !== 0 ? (((query.item_data.freight + query.item_data.overhead) / query.item_data.sales) * 100).toFixed(2) : "N/A"}% of Sales
                                        </p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>GP & Margin %:</h2>
                                        <p>
                                            {(query.item_data.sales - query.item_data.costs - query.item_data.tradefees - query.item_data.rebates - query.item_data.freight - query.item_data.overhead)
                                                .toLocaleString('en', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }
                                            )}
                                        </p>    
                                        <p>
                                            {query.item_data.sales !== 0 ? (((query.item_data.sales - query.item_data.costs - query.item_data.tradefees - query.item_data.rebates - query.item_data.freight - query.item_data.overhead)/query.item_data.sales)*100)
                                                .toFixed(2) : "N/A"    
                                            }% of Sales
                                        </p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Avg Price Sold:</h2>
                                        <p>
                                            {query.item_data.quantity > 0 ? (query.item_data.sales / query.item_data.quantity)
                                                .toLocaleString('en', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }
                                            ) : "N/A"}
                                        </p>
                                    </div>
                                    <div className="kpi-container kpi-boxes">
                                        <h2>Avg Price after Disc:</h2>
                                        <p>
                                            {query.item_data.quantity !== 0 ? ((query.item_data.sales - query.item_data.tradefees - query.item_data.rebates) / query.item_data.quantity)
                                                .toLocaleString('en', {
                                                    style: 'currency',
                                                    currency: 'USD',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }
                                            ) : "N/A"}
                                        </p>
                                    </div>                                    
                                </div>                                    
                            </div>
                        </section>                        
                        <section id="charts">
                            <div className="chart-container grid">
                                <div className="chart-container">
                                    <div className="chart-title"><h2>Breakdown of Sale</h2></div>
                                    <div className="sub-title"><p>{dates}</p></div>
                                    <div className="chart">
                                        <SimpleRadarChart/>
                                    </div>
                                </div>
                                <div className="chart-container">
                                    <div className="chart-title"><h2>Sales Over Time</h2></div>
                                    <div className="sub-title"><p>{dates}</p></div>
                                    <div className="chart">
                                        <SimpleBarChart />
                                    </div>
                                </div>                                                
                                <div className="chart-container">
                                    <div className="chart-title"><h2>Breakdown of Customers</h2></div>    
                                    <div className="sub-title"><p>{dates}</p></div>                                
                                    <div className="chart">                                    
                                        <SimplePieChart />
                                    </div>
                                </div>
                            </div>
                        </section>                        
                        <section id="table">
                            <div className="data-table-container grid">
                                <div className="data-table-title"><h2>Sales Details</h2></div>
                                <div className="sub-title"><p>{dates}</p></div>
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

export default withSizes(mapSizesToProps)(Dashboard);