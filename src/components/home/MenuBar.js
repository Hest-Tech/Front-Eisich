import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    loadProductCategories,
    loadProductSubCategories,
    hideSubCategories,
    displaySubCategories,
    fetchProducts
} from '../../actions/products';


class MenuBar extends React.Component {
    constructor(props) {
        super(props);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.fetchCategory = this.fetchCategory.bind(this);
    }

    onMouseEnter(name) {
        // this.setState(this.toggleHoverState);
        if (name === undefined) {
            this.props.hideSubCategories();
        } else {
            this.props.loadProductSubCategories(name)
        }
        // console.log('Enter: ', this.props.products.displaySubCategories);
    }

    onMouseLeave() {
        this.props.hideSubCategories();
        // console.log('Leave: ', this.props.products.displaySubCategories);
    }

    onNavMouseEnter() {
        // Replace this line with join statements function
        !!this.props.products.subCategories.length && this.props.displaySubCategories();    
    }

    onNavMouseLeave() {
        this.props.hideSubCategories();
    }

    fetchCategory(e) {
        const sku = e.target.dataset.sku;
        const name = e.target.dataset.name;
        const title = e.target.dataset.title;

        localStorage.setItem('selectCategory', JSON.stringify({ sku, name, title }));

        this.props.fetchProducts(sku, name, title);
    }

    componentDidMount() {
        // console.log('mainCategories: ', this.props.products.mainCategories)
    }

    render() {
        return (
            <div className="menu-bar-container container-fluid menu-container menu-bar-wrapper">
                <nav className="container-fluid__container category-nav">
                    <div className="category-nav__wrapper">
                        <small className="text-muted categories">Categories</small>
                        <div className="category-items">
                            {                                
                                !!this.props.products.mainCategories.length && this.props.products.mainCategories.map((category, i) => (
                                    <NavLink
                                        className="menu-link"
                                        to={`products${category.path}`}
                                        onMouseEnter={() => this.onNavMouseEnter()}
                                        onMouseLeave={() => this.onNavMouseLeave()}
                                        style={{ textDecoration: 'none' }}
                                        key={i}
                                    >
                                        <div
                                            className="menu-bar-div"
                                            onMouseEnter={() => this.onMouseEnter(category.name)}
                                            // style={this.props.products.displaySubCategories ? {color: '#E9BD4C'} : {color: '#505050'}}
                                            // onMouseLeave={() => this.onMouseLeave()}
                                            data-sku={category.sku}
                                            data-name="MAIN_CATEGORY"
                                            data-title={category.name}
                                            onClick={this.fetchCategory}
                                        >
                                            <i className="fa fa-area-chart mr-2"></i>
                                            {category.name}
                                        </div>
                                    </NavLink>
                                ))
                            }
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    products: state.products
})

const mapDispatchToProps = (dispatch) => ({
    loadProductCategories: () => dispatch(loadProductCategories()),
    displaySubCategories: () => dispatch(displaySubCategories()),
    hideSubCategories: () => dispatch(hideSubCategories()),
    fetchProducts: (sku, name, title) => dispatch(fetchProducts(sku, name, title)),
    loadProductSubCategories: (name) => dispatch(loadProductSubCategories(name))
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);