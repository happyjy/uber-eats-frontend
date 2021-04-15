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

export interface restaurantQeury_restaurant_restaurant_menu_options_choices {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface restaurantQeury_restaurant_restaurant_menu_options {
  __typename: "DishOption";
  id: number;
  name: string;
  extra: number | null;
  choices: restaurantQeury_restaurant_restaurant_menu_options_choices[] | null;
}

export interface restaurantQeury_restaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  hidden: boolean;
  order: number | null;
  options: restaurantQeury_restaurant_restaurant_menu_options[] | null;
}

export interface restaurantQeury_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: restaurantQeury_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: restaurantQeury_restaurant_restaurant_menu[];
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
