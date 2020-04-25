import React from 'react';
import { observer } from 'mobx-react'
import { dateHelper } from '../utilities/utilities'
import withSizes from 'react-sizes'
import github from '../assets/GitHub-Mark-Light-64px.png'
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

var placeholder;
var title;
var limiter;

if (process.env.REACT_APP_DUMMY) {
    title = "Sample Data Fetch and Display"
    placeholder = "Enter an Item ID:"          //TODO, search by ID or Name
    limiter = 0
} else {
    placeholder = "Enter an Item ID: (ROI ID)"
    title = "Busse Hospital Disposables"
    limiter = 0
}

const Dashboard = observer(({isMobile}) => {
    // const history = useHistory()
    const [valid, isValid] = React.useState(false)
    const dates = `${dateHelper(query.start)} - ${dateHelper(query.end)}`
    const [item, setItem] = React.useState('')
    const [description, setDescription] = React.useState('')
    const [items, setItems] = React.useState([])
    const [active, setActive] = React.useState('')
    const itemRef = React.useRef(null);
    const startRef = React.useRef(null);

    React.useEffect(() => {
		auth.isAuth && itemRef.current.focus();
    }, []);

    const validItem = async (item) => {
        if (item.length > limiter) {
            const res = await query.fetch_item_description(item)

            setItems(res)

            const regex = new RegExp(`^${item}$`)
            const match = res.find(i => regex.test(i.item_id))

            if (match) {
                setActive(match.item_id)
                setDescription(match.item_description)
                isValid(true)
                setItems(items.filter(i => match.item_id === i.item_id))
            } else {
                setActive('')
                setDescription('')
                isValid(false)
            }
        }
    }

    React.useEffect(
        () => {
            console.log(item)
            validItem(item)
        },
        [item]
    )

    React.useEffect(
        () => {
            if (active === '') {
                query.dataIsLoaded = false
            }
        },
        [active]
    )

    return (
        <div className="dashboard disable-scrollbars">
            <section id="header">
                <nav className="nav grid">
                    <h1>{title}</h1>

                    <ul>
                        <li><a href="#options-selector">Data Selector</a></li>
                        <li><a href="#kpi">KPI</a></li>
                        <li><a href="#charts">Charting</a></li>
                        <li><a href="#table">Tables</a></li>
                    </ul>
                </nav>
                <div className="github-logo"><a href="https://github.com/jlmodell/sa-mobile" _target="blank"><img src={github} alt="github" height="64"/></a></div>
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
                                Fetch Data
                            </button>
                            <input className={valid ? "options" : "options invalid"} autoComplete="off" placeholder={placeholder} ref={itemRef} name="item" type="text" value={item} onChange={(e) => {
                                setItem(e.target.value)
                                query.item = e.target.value
                                localStorage.setItem('item', e.target.value)
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

                        {!query.dataIsLoaded && items && item.length >=1 && <div className="options-container-list">
                            <div style={{color:"white"}} className="choose-one">Choose (1) One.</div>
                            <ul>
                                {items.map((item,index) => (
                                    <li
                                        key={index}
                                        className={active === item.item_id ? "options-container-li-active" : "options-container-li"}
                                        onClick={() => {
                                            setActive(item.item_id)
                                            setItem(item.item_id)
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
                    <h2>No sales of {active} - {description} were found during {dates}.</h2>
                </div>
            }

            {(!query.isLoading && query.dataIsLoaded && active !== "") && !query.noSales &&
                (
                    <>
                        <section id="kpi">
                            <div className="kpi-outer-container">
                                <div className="title"><h2>[{active}] {description}</h2></div>
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
                                    <div className="chart-title"><h2>Breakdown of Cost Centers of [{active}] {description}</h2></div>
                                    <div className="sub-title"><p>{dates}</p></div>
                                    <div className="chart">
                                        <SimpleRadarChart/>
                                    </div>
                                </div>
                                <div className="chart-container">
                                    <div className="chart-title"><h2>Sales Over Time of [{active}] {description}</h2></div>
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
                                <div className="data-table-title"><h2>Sales Details of [{active}] {description}</h2></div>
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
