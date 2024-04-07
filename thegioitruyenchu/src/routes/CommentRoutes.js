import React from 'react';
import { Route, Switch } from 'react-router-dom';

import CommentList from '../components/Comments/CommentList';
import CommentForm from '../components/Comments/CommentForm';

function CommentRoutes() {
  return (
    <Switch>
      <Route exact path="/comments" component={CommentList} />
      <Route path="/comments/new" component={CommentForm} />
    </Switch>
  );
}

export default CommentRoutes;
