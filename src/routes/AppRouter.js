import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import App from '../App';
import NavBar from '../components/NavBar';
import HelpPage from '../components/HelpPage';
import NotFoundPage from '../components/NotFoundPage';
import ProductsPage from '../components/ProductsPage';
import AboutPage from '../components/AboutPage';
import Footer from '../components/Footer';

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <div className="App">
                <NavBar />
                <Switch>
                    <Route path="/" component={App} exact={true} />  
                    <Route path="/products" component={ProductsPage} />  
                    <Route path="/about" component={AboutPage} />  
                    {/* <Route path="/edit/:id" component={EditExpensePage} /> */}
                    <Route path="/help" component={HelpPage} />
                    <Route component={NotFoundPage} />
                </Switch>
                <Footer />
            </div>
        </div>
    </BrowserRouter>
);

export default AppRouter;