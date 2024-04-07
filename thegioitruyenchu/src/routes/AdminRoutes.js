import React from 'react';
import { Route, Switch } from 'react-router-dom';

import AdminApproval from '../components/Admin/AdminApproval';
import AdminCreate from '../components/Admin/AdminCreate';

function AdminRoutes() {
  return (
    <Switch>
      <Route exact path="/admin/approve" component={AdminApproval} />
      <Route path="/admin/create" component={AdminCreate} />
    </Switch>
  );
}

export default AdminRoutes;
