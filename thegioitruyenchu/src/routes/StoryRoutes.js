import React from 'react';
import { Route, Switch } from 'react-router-dom';

import StoryList from '../components/Stories/StoryList';
import StoryDetail from '../components/Stories/StoryDetail';
import StoryForm from '../components/Stories/StoryForm';

function StoryRoutes() {
  return (
    <Switch>
      <Route exact path="/stories" component={StoryList} />
      <Route path="/stories/:id" component={StoryDetail} />
      <Route path="/stories/new" component={StoryForm} />
    </Switch>
  );
}

export default StoryRoutes;
