/**
 * Products action
 */

import axios from 'axios';

import fire, { database } from '../firebase/firebase';
import {
    LOAD_SUB_CATEGORIES,
    LOAD_MAIN_CATEGORIES,
    LOAD_INNER_CATEGORIES,
    HIDE_SUB_CATEGORIES,
    DISPLAY_SUB_CATEGORIES,
    FETCH_PRODUCTS,
    FETCH_PRODUCT,
    ADD_TO_CART,
    FETCH_CART
} from './types';

const url = "http://localhost:5000/api/v1";

// load products
export const loadProductCategories = () => dispatch => {

    axios
        .get(`${url}/mainCategories`)
        .then(response => {
            const mainCategories = response.data.data;
            const productMainCategories = [];
            
            mainCategories.map(category => {
                productMainCategories.push(category);
            })

            localStorage.setItem('mainCategories', JSON.stringify(productMainCategories));

            return dispatch({
                type: LOAD_MAIN_CATEGORIES,
                payload: productMainCategories
            })
        })
        .catch(error => console.log(error))
}

// load product categories
export const loadProductSubCategories = name => dispatch => {

    axios
        .get(`${url}/subCategories/${name}`)
        .then(response => {
            const subCategories = response.data.data;
            // console.log('subCategories: ', subCategories)
            dispatch({
                type: LOAD_SUB_CATEGORIES,
                payload: subCategories
            });
        })
        .catch(error => console.log(error))
}

// hide product sub categories
export const hideSubCategories = () => dispatch => dispatch({
    type: HIDE_SUB_CATEGORIES
});

// show product sub categories
export const displaySubCategories = () => dispatch => dispatch({
    type: DISPLAY_SUB_CATEGORIES
});

// fetch products
export const fetchProducts = (sku, name) => dispatch => {
    axios
        .get(`${url}/products`)
        .then(response => {
            const products = response.data.data;
            let filteredProducts;
            console.log(name, ' : ', products)

            switch(name) {
                case 'MAIN_CATEGORY':
                    filteredProducts = products.filter(item => item.mainCategory === sku)
                    console.log("MAIN_CATEGORY: ", filteredProducts);
                    break;
                case 'SUB_CATEGORY':
                    filteredProducts = products.filter(item => item.subCategory === sku);
                    console.log("SUB_CATEGORY: ", filteredProducts);
                    // console.log("SUB_CATEGORY: ", sku);
                    break;
                case 'INNER_CATEGORY':
                    filteredProducts = products.filter(item => item.innerCategory === sku)
                    console.log("INNER_CATEGORY: ", filteredProducts);
                    break;
            }

            localStorage.setItem('products', JSON.stringify(filteredProducts));

            console.log(filteredProducts);
            dispatch({
                type: FETCH_PRODUCTS,
                payload: filteredProducts
            })
        })
        .catch(error => console.log(error))
}

// fetch single product
export const fetchProduct = (pid) => dispatch => {
    axios
        .get(`${url}/product/${pid}`)
        .then(response => {
            const product = response.data.data;
            console.log('product: ', product);

            localStorage.setItem('product', JSON.stringify(product));
            dispatch({
                type: FETCH_PRODUCT,
                payload: product
            })
        })
        .catch(error => console.log(error))
}