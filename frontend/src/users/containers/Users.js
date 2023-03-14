// SHOW USERS
// Route from App.js: path="/"
import React from 'react';

import UsersList from '../components/UsersList';
import { USERS } from '../../shared/util/constants';

const Users = () => {
  return <UsersList items={USERS}></UsersList>;
};

export default Users;
