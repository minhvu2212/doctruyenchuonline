import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Import các component
import AuthRoutes from './routes/AuthRoutes';
import CategoryRoutes from './routes/CategoryRoutes';
import TagRoutes from './routes/TagRoutes';
import StoryRoutes from './routes/StoryRoutes';
import ChapterRoutes from './routes/ChapterRoutes';
import CommentRoutes from './routes/CommentRoutes';
import BookmarkRoutes from './routes/BookmarkRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          {/* Định tuyến cho các routes */}
          <Route path="/auth" component={AuthRoutes} />
          <Route path="/categories" component={CategoryRoutes} />
          <Route path="/tags" component={TagRoutes} />
          <Route path="/stories" component={StoryRoutes} />
          <Route path="/chapters" component={ChapterRoutes} />
          <Route path="/comments" component={CommentRoutes} />
          <Route path="/bookmarks" component={BookmarkRoutes} />
          <Route path="/admin" component={AdminRoutes} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
