import { observable } from 'mobx';
import Cookies from 'js-cookie';
import { GraphQLClient } from 'graphql-request';
import Progress from 'rsup-progress';

const client = new GraphQLClient('http://104.200.28.226:4000/graphql', {
	credentials: 'include'
});

const progress = new Progress({
	height: 5,
	color: '#266dd3'
});

const buildPieChartName = (pct) => {
	return `Others < ${(pct * 100).toFixed(1)}% sold`;
};

var Store = observable({
	email: '', //
	password: '', //
	token: null, //
	period: 'currentPeriod',
	async setCookies(query, variables) {
		//
		try {
			const res = await client.request(query, variables);
			if (res.login.authorized) {
				Store.token = true;
			}
		} catch (err) {
			Store.token = null;
			// console.log(err.response.errors[0].message);
			alert(err.response.errors[0].message);
		}
	},
	async unSetCookies() {
		//
		Cookies.remove('access-token');
		Cookies.remove('refresh-token');
		return true;
	},
	minBar: false,       // ??
	setMinBar() {
		Store.minBar = !Store.minBar;
	},
	item: localStorage.getItem('item') || '',
	itemName: localStorage.getItem('item-name') || '',
	async gql_fetch_itemName() {
		const query = `
                query Item($item: String!) {
                    item(iid: $item)
                }
            `;
		const variables = {
			item: Store.item
		};

		try {
			const res = await client.request(query, variables);
			// console.log(res.item);
			Store.itemName = res.item;
			localStorage.setItem('item-name', res.item);
		} catch (err) {
			// console.log(err);
			Store.itemName = '';
			localStorage.removeItem('item-name');
		}
	},
	endingPeriod: localStorage.getItem('endingPeriod') || '2019-12-31',
	get oneYearPriorEndingPeriod() {
		let ep = new Date(Store.endingPeriod);
		return new Date(ep.getFullYear() - 1, ep.getMonth(), ep.getDate() + 1).toISOString().substring(0, 10);
	},
	get twoYearPriorEndingPeriod() {
		let ep = new Date(Store.endingPeriod);
		return new Date(ep.getFullYear() - 2, ep.getMonth(), ep.getDate() + 1).toISOString().substring(0, 10);
	},
	get twoYearPriorStartingPeriod() {
		let ep = new Date(Store.endingPeriod);
		return new Date(ep.getFullYear() - 3, ep.getMonth(), ep.getDate() + 1).toISOString().substring(0, 10);
	},
	get zeroYear() {
		return `Ending Period: ${Store.endingPeriod}`;
	},
	get oneYear() {
		return `Ending Period: ${Store.oneYearPriorEndingPeriod}`;
	},
	get twoYear() {
		return `Ending Period: ${Store.twoYearPriorEndingPeriod}`;
	},
	avgQty: 0,
	avgSales: 0,
	avgCosts: 0,
	pieChartData: [],
	barChartData: [],
	colorMap: {},
	colorMapChoices: [ '#209BDD', '#1581E6', '#0860BF' ],
	dataTableData: [],
	async gql_fetch_data() {
		Store.isLoaded = false;

		const query = `
                query Sales($start: String!, $end: String!, $item: String!, $freight: Float, $overhead: Float, $commissions: Float) {
                    sales(start:$start, end:$end, item:$item, freight:$freight, overhead:$overhead, commissions:$commissions) {
                        _id {
                            iid
                            item
                            cid
                            customer
                        }
                        quantity
                        sales
                        costs
                        rebates
                        tradefees
                        commissions
                        freight
                        overhead
                        grossProfit
                        grossProfitMargin
                    }
                }
            `;

		const variables = [
			{
				start: Store.twoYearPriorStartingPeriod,
				end: Store.twoYearPriorEndingPeriod,
				item: Store.item,
				period: `FY: ${Store.twoYearPriorEndingPeriod}`
			},
			{
				start: Store.twoYearPriorEndingPeriod,
				end: Store.oneYearPriorEndingPeriod,
				item: Store.item,
				period: `FY: ${Store.oneYearPriorEndingPeriod}`
			},
			{
				start: Store.oneYearPriorEndingPeriod,
				end: Store.endingPeriod,
				item: Store.item,
				period: `FY: ${Store.endingPeriod}`
			}
		];

		const headerBoxesData = [];
		const barChartData = [];
		const colorMap = {};
		const pieChartData = [];
		const dataTableData = [];
		let exportCustomers = [ '8497' ];
		var periods = 0;

		progress.start();

		for (let x = 0; x < variables.length; x++) {
			try {
				const res = await client.request(query, variables[x]);

				// res.sales is the [master]

				// header boxes
				let headerBoxes = {};
				headerBoxes.sales = res.sales.reduce((acc, val) => {
					return acc + val.sales;
				}, 0);
				headerBoxes.quantity = res.sales.reduce((acc, val) => {
					return acc + val.quantity;
				}, 0);
				headerBoxes.costs = res.sales.reduce((acc, val) => {
					return (
						acc + (val.costs + val.rebates + val.tradefees + val.commissions + val.freight + val.overhead)
					);
				}, 0);
				// console.log(headerBoxes);
				headerBoxesData.push(headerBoxes);

				// bar chart
				// period: #, value: #
				let barChartTemp = {};
				barChartTemp.period = variables[x].period;
				barChartTemp.value = headerBoxes.sales;
				// console.log(barChartTemp);
				colorMap[barChartTemp.period] = Store.colorMapChoices[x];
				barChartData.push(barChartTemp);
				// console.log(barChartdata);

				// pie chart
				let comparisonPct = 0.018;
				let periodSum = headerBoxes.quantity;
				// console.log(periodSum);
				let pieChartTemp = [];
				res.sales.forEach((x) => {
					if (!pieChartTemp.includes(x._id.cid + ' ' + x._id.customer)) {
						pieChartTemp.push({ name: x._id.cid + ' ' + x._id.customer, value: x.quantity });
					}
				});
				pieChartTemp.sort((a, b) => b.value - a.value);
				// console.log(pieChartTemp.length);
				// console.log(pieChartTemp);
				let finalPieChartdata = [];
				let all_others = 0;
				for (let i = 0; i < pieChartTemp.length; i++) {
					if (pieChartTemp[i].value > periodSum * comparisonPct) {
						finalPieChartdata.push(pieChartTemp[i]);
						// console.log(pieChartTemp[i].y);
					} else {
						all_others = all_others + pieChartTemp[i].value;
					}
				}
				// console.log(finalPieChartdata);
				let pieObject = {};
				pieObject.name = buildPieChartName(comparisonPct);
				pieObject.value = all_others;
				if (all_others > 0) {
					finalPieChartdata.push(pieObject);
				} else if (finalPieChartdata.length === 0) {
					finalPieChartdata.push(pieObject);
				}
				pieChartData.push(finalPieChartdata);
				// console.log(pieChartdata);

				// data chart
				// console.log(res.sales);
				const sales = res.sales;
				sales.forEach((x) => {
					x.customer = x._id.customer;
					x.cid = x._id.cid;
					delete x._id;
					if (exportCustomers.includes(x.cid)) {
						x.freight = 0;
						x.commissions = 0;
					}
					x.averagePricePerCase = x.sales / x.quantity;
					x.averageSellPricePerCaseAfterDiscountsAndRebates =
						(x.sales - x.rebates - x.tradefees) / x.quantity;
					x.difference = x.averagePricePerCase - x.averageSellPricePerCaseAfterDiscountsAndRebates;
				});
				dataTableData.push(sales);
				// console.log(sales);

				// periods calculation
				periods = periods + 1;
				// console.log(periods);
			} catch (err) {
				let barChartTemp = {};
				barChartTemp.period = variables[x].period;
				barChartTemp.sales = 0;
				barChartData.push(barChartTemp);
				dataTableData.push([]);
				// console.log(err);
			}
		}

		// headerBoxesData.reduce((acc, val) => {
		// }, {})

		Store.avgQty =
			headerBoxesData.reduce((acc, val) => {
				return acc + val.quantity;
			}, 0) / periods;
		Store.avgSales =
			headerBoxesData.reduce((acc, val) => {
				return acc + val.sales;
			}, 0) / periods;
		Store.avgCosts =
			headerBoxesData.reduce((acc, val) => {
				return acc + val.costs;
			}, 0) / periods;
		Store.barChartData = barChartData;
		// console.log(Store.barChartData)
		Store.pieChartData = pieChartData;
		// console.log(Store.pieChartData)
		// console.log(pieChartData)
		Store.dataTableData = dataTableData;
		Store.colorMap = colorMap;

		Store.isLoaded = true;

		progress.end();
	},
	isLoaded: false,
	async gql_fetch(query, variables) {
		const res = await client.request(query, variables);
		console.log(res);
	}
});

export default Store;
