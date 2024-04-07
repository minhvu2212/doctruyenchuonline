import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CategoryList from '../components/Categories/CategoryList';
import CategoryDetail from '../components/Categories/CategoryDetail';
import CategoryForm from '../components/Categories/CategoryForm';

function CategoryRoutes() {
  return (
    <Switch>
      <Route exact path="/categories" component={CategoryList} />
      <Route path="/categories/:id" component={CategoryDetail} />
      <Route path="/categories/new" component={CategoryForm} />
    </Switch>
  );
}

export default CategoryRoutes;
