/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum HiddenType {
  ALL = "ALL",
  FALSE = "FALSE",
  TRUE = "TRUE",
}

export enum OrderStatus {
  Cooked = "Cooked",
  Cooking = "Cooking",
  Delivered = "Delivered",
  Pending = "Pending",
  PickedUp = "PickedUp",
}

export enum OrderType {
  ASC = "ASC",
  DESC = "DESC",
}

export enum UserRole {
  Client = "Client",
  Delivery = "Delivery",
  Owner = "Owner",
}

export interface CategoryInput {
  page?: number | null;
  slug: string;
}

export interface CreateAccountInput {
  email: string;
  password?: string | null;
  role: UserRole;
}

export interface CreateDishInput {
  name: string;
  price: number;
  description: string;
  options?: DishOptionInputType[] | null;
  restaurantId: number;
}

export interface CreateOrderInput {
  restaurantId: number;
  items: CreateOrderItemInput[];
}

export interface CreateOrderItemInput {
  dishId: number;
  options?: OrderItemOptionInputType[] | null;
}

export interface CreateRestaurantInput {
  name: string;
  coverImg: string;
  address: string;
  categoryName: string;
}

export interface DeleteDishInput {
  dishId: number;
}

export interface DishChoiceInputType {
  name: string;
  extra?: number | null;
}

export interface DishOptionInputType {
  id: number;
  name: string;
  choices?: DishChoiceInputType[] | null;
  extra?: number | null;
}

export interface EditDishInput {
  name?: string | null;
  price?: number | null;
  description?: string | null;
  options?: DishOptionInputType[] | null;
  hidden?: boolean | null;
  order?: number | null;
  dishId: number;
}

export interface EditOrderInput {
  id: number;
  status: OrderStatus;
}

export interface EditProfileInput {
  email?: string | null;
  password?: string | null;
  role?: UserRole | null;
}

export interface GetOrderInput {
  id: number;
}

export interface LoginInput {
  email: string;
  password?: string | null;
}

export interface MyRestaurantInput {
  id: number;
  hiddenType?: HiddenType | null;
  orderType?: OrderType | null;
}

export interface OrderItemOptionInputType {
  name: string;
  choice?: string | null;
}

export interface OrderUpdatesInput {
  id: number;
}

export interface RestaurantInput {
  restaurantId: number;
}

export interface RestaurantsInput {
  page?: number | null;
}

export interface SearchRestaurantInput {
  page?: number | null;
  query: string;
}

export interface TakeOrderInput {
  id: number;
}

export interface VerifyEmailInput {
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
