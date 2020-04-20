import { observable } from 'mobx';
import axios from 'axios'
import Progress from 'rsup-progress';
import auth from './auth.store'

const progress = new Progress({
	height: 10,
	color: '#266dd3'
});

var base

if (process.env.REACT_APP_DUMMY) {
    base = "https://busseweb.com:9091"
} else {
    base = "https://busseweb.com:9090"
}

const api = `${base}/api/sales/item_`
const item = `${base}/api/item_description`
const quantity_sold_per_month = `${base}/api/sales/summary_`

const query_store = observable({
    isLoading: false,
    dataIsLoaded: false,
    noSales: false,
    start: localStorage.getItem("start") || '',
    end: localStorage.getItem("end") || '',
    item: '',    
    // item_name: localStorage.getItem("item_name") || '',
    item_data: [],
    customers_data: [],
    qty_sold_per_month: [],
    async fetch_item_description(iid) {
        const res = await axios.get(item, {
            params: {
                item: iid
            }
        })

        return res.data
    },
    fetch_data() {
        this.isLoading = true
        this.dataIsLoaded = false
        progress.start();

        let params

        const headers = {
            Authorization: `Bearer ${auth.token}`
        }
        
        if (query_store.item) {
            params = {
                start: query_store.start,
                end: query_store.end,
                item: query_store.item,
            }
        } else {
            params = {
                start: query_store.start,
                end: query_store.end,                
            }
        }        

        const request_one = axios.get(api, {
            headers,
            params,
        })
        const request_two = axios.get(quantity_sold_per_month, {
            headers,
            params
        })

        axios.all([request_one, request_two])
            .then(axios.spread((...res) => {
                const res_one = res[0]
                const res_two = res[1]
                
                if (res_one.data.data.length === 0) {
                    this.noSales = true
                    return
                }
                // resolve all store functions
                this.item_data = res_one.data.data[0]
                this.customers_data = res_one.data.data[0].customer_details
                this.qty_sold_per_month = res_two.data
                this.noSales = false             
                
            }))
            .then(() => {
                // resolve bool for dom updates
                this.isLoading = false
                this.dataIsLoaded = true
                
                // resolve progress bar
                progress.end();
            })
            .catch(err => console.log(err))
    }
})

export default query_store