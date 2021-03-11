import React from "react";
import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../__generated__/meQuery";
import { Restaurants } from "../pages/client/restaurants";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

const ClientRoutes = [
  <Route path="/" exact>
    <Restaurants />
  </Route>,
];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  console.log("### data: ", data);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Redirect from="/potato" to="/" />
      </Switch>
    </Router>
  );
};
