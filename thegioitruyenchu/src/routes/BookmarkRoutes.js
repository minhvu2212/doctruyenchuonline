import React from 'react';
import { Route, Switch } from 'react-router-dom';

import BookmarkButton from '../components/Bookmarks/BookmarkButton';
import BookmarkList from '../components/Bookmarks/BookmarkList';

function BookmarkRoutes() {
  return (
    <Switch>
      <Route exact path="/bookmarks" component={BookmarkList} />
      <Route path="/bookmarks/new" component={BookmarkButton} />
    </Switch>
  );
}

export default BookmarkRoutes;
