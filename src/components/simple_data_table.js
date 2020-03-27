import React from "react";
import { observer } from "mobx-react";
import MUIDataTable from "mui-datatables";
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Store from '../store/store'

const SimpleDataTable = observer(() => {
  var data;
  var title;

  switch (Store.period) {
      case "currentPeriod":
          data = Store.dataTableData[2]
          title = Store.zeroYear
          break
      case "oneYearPriorPeriod":
          data = Store.dataTableData[1]
          title = Store.oneYear
          break
      case "twoYearPriorPeriod":
          data = Store.dataTableData[0]
          title = Store.twoYear
          break
      default:
          break
  }        

  const columns = [
    {
      label: "Customer",
      name: "customer",      
      options: {
        filter: true,
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={0} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
            {columnMeta.label}
          </th>
        )
      }
    },
    {
      label: "ID",
      name: "cid",
      options: {
        filter: true,
        customHeadRender: (columnMeta) => (
          <th key={1} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
            {columnMeta.label}
          </th>
        )
      }
    },
    {
      label: "Qty Sold",
      name: "quantity",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={2} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Avg $Price/Cs",
      name: "averagePricePerCase",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={3} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Avg $Rebated/Cs",
      name: "averageSellPricePerCaseAfterDiscountsAndRebates",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={4} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Sales",
      name: "sales",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={5} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Mfg Costs",
      name: "costs",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={6} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Rebates",
      name: "rebates",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={7} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Trade Discounts",
      name: "tradefees",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={8} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Freight",
      name: "freight",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={9} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Overhead",
      name: "overhead",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={10} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Commissions",
      name: "commissions",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={11} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
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
      label: "Gross Profit Margin",
      name: "grossProfitMargin",
      options: {
        sort: true,
        customHeadRender: (columnMeta) => (
          <th key={12} style={{ wordWrap: 'normal', padding: '10px', fontSize: '0.7em', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer' }}>
            {columnMeta.label}
          </th>
        ),
        customBodyRender: (value, _, __) => {
          return parseFloat(value).toFixed(2) + "%";
        }
      }
    }
  ];

  const options = {      
      filter: true,
      filterType: "dropdown",
      responsive: "stacked",
      selectableRows: "none",
  };

  const getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTable: {
        root: {
        },
        paper: {
          boxShadow: "none",
        }
      },
      MUIDataTableBodyRow: {
        root: {
          '&:nth-child(odd)': { 
            backgroundColor: '#a9bcd0'
          }
        }
      },
      MUIDataTableBodyCell: {
      }
    }
  })

  return (
    <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={title}
        data={data}
        columns={columns}
        options={options}
      />
    </MuiThemeProvider>
  );
});
  
  export default SimpleDataTable;