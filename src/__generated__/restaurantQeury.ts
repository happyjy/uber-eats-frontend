/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: restaurantQeury
// ====================================================

export interface restaurantQeury_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface restaurantQeury_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantQeury_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
}

export interface restaurantQeury_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: restaurantQeury_restaurant_restaurant | null;
}

export interface restaurantQeury {
  restaurant: restaurantQeury_restaurant;
}

export interface restaurantQeuryVariables {
  input: RestaurantInput;
}
