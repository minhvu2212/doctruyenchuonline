import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ChapterList from '../components/Chapters/ChapterList';
import ChapterDetail from '../components/Chapters/ChapterDetail';
import ChapterForm from '../components/Chapters/ChapterForm';

function ChapterRoutes() {
  return (
    <Switch>
      <Route exact path="/chapters" component={ChapterList} />
      <Route path="/chapters/:id" component={ChapterDetail} />
      <Route path="/chapters/new" component={ChapterForm} />
    </Switch>
  );
}

export default ChapterRoutes;
