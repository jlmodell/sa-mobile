import React from 'react';
import { observer } from 'mobx-react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import query from '../store/query.store';

const SimpleDataTable = observer(() => {
  var title;

  const [data] = React.useState(query.customers_data.map(c => {
    return {
      customer: c._id.customer,
      cid: c._id.cid,
      quantity: c.quantity,
      sales: c.sales,
      costs: c.costs,
      commissions: c.commissions,
      tradefees: c.tradefees,
      rebates: c.rebates,
      freight_overhead: c.freight + c.overhead,
      gross_profit: c.sales - c.costs - c.commissions - c.tradefees - c.freight - c.overhead - c.rebates,
      gross_profit_margin: ((c.sales - c.costs - c.commissions - c.tradefees - c.freight - c.rebates - c.overhead)/c.sales)*100
    }
  }))

	const columns = [
		{
			label: 'Customer',
			name: 'customer',
			options: {
				filter: true,
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={0}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				)
			}
		},
		{
			label: 'ID',
			name: 'cid',
			options: {
				filter: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={1}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
                            cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				)
			}
		},
		{
			label: 'Qty Sold',
			name: 'quantity',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={2}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 0
					});
				}
			}
		},
		{
			label: 'Sales',
			name: 'sales',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={5}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					});
				}
			}
		},
		{
			label: 'Mfg Costs',
			name: 'costs',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={6}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					});
				}
			}
		},
		{
			label: 'Rebates',
			name: 'rebates',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={7}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					});
				}
			}
		},
		{
			label: 'Trade Discounts',
			name: 'tradefees',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={8}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					});
				}
			}
		},
		{
			label: 'Freight & Overhead',
			name: 'freight_overhead',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={9}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					});
				}
			}
		},
		{
			label: 'Commissions',
			name: 'commissions',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={10}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					});
				}
			}
    },
    {
			label: 'GP',
			name: 'gross_profit',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={11}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return value.toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					});
				}
			}
		},
		{
			label: 'GPM',
			name: 'gross_profit_margin',
			options: {
				sort: true,
				customHeadRender: (columnMeta, handleToggleColumn) => (
					<th
						key={12}
						style={{
							wordWrap: 'normal',
							padding: '10px',
							fontSize: '0.7em',
							textAlign: 'left',
							fontWeight: 'bold',
							cursor: 'pointer'
						}}
                        onClick={() => handleToggleColumn(columnMeta.index)}
					>
						{columnMeta.label}
					</th>
				),
				customBodyRender: (value, _, __) => {
					return parseFloat(value).toFixed(2) + '%';
				}
			}
		}
	];

	const options = {
		filter: true,
		filterType: 'dropdown',
		responsive: 'stacked',
		selectableRows: 'none'
	};

	const getMuiTheme = () =>
		createMuiTheme({
			overrides: {
				MUIDataTable: {
					root: {},
					paper: {
						boxShadow: 'none'
					}
				},
				MUIDataTableBodyRow: {
					root: {
						'&:nth-child(odd)': {
							backgroundColor: '#a9bcd0',
							zIndex: -1
						}
					}
				},
				MUIDataTableBodyCell: {}
			}
		});

	return (
		<MuiThemeProvider theme={getMuiTheme()}>
			<MUIDataTable title={title} data={data} columns={columns} options={options} />
		</MuiThemeProvider>
	);
});

export default SimpleDataTable;
