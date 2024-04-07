import React from 'react';
import { Route, Switch } from 'react-router-dom';

import TagList from '../components/Tags/TagList';
import TagDetail from '../components/Tags/TagDetail';
import TagForm from '../components/Tags/TagForm';

function TagRoutes() {
  return (
    <Switch>
      <Route exact path="/tags" component={TagList} />
      <Route path="/tags/:id" component={TagDetail} />
      <Route path="/tags/new" component={TagForm} />
    </Switch>
  );
}

export default TagRoutes;
