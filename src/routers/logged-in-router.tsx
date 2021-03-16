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
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { NotFound } from "../pages/pages/404";
import { Search } from "../pages/client/search";

const ClientRoutes = [
  <Route key={1} path="/" exact>
    <Restaurants />
  </Route>,
  <Route key={2} path="/confirm">
    <ConfirmEmail />
  </Route>,
  <Route key={3} path="/edit-profile">
    <EditProfile />
  </Route>,
  <Route key={4} path="/search">
    <Search />
  </Route>,
  <Route key={5}>
    <NotFound />
  </Route>,
];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();
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
      <Header />
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
