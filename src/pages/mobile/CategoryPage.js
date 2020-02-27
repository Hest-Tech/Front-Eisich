import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import NavBar from '../../components/NavBar';


const CategoryPage = ({ products }) => {
	return (
		<Fragment>
			<NavBar />
			{
				!!products.mainCategories.length && products.mainCategories.map((category, i) => {
					return <b key={i}>{category.name}</b>
				})
			}
		</Fragment>
	);
}

const mapStateToProps = (state) => ({
    products: state.products
});

const mapDispatchToProps = (dispatch) => ({
    // openAuthPopUp: () => dispatch(openAuthPopUp()),
    // loadUser: () => dispatch(loadUser()),
    // signOutUser: () => dispatch(signOutUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryPage);