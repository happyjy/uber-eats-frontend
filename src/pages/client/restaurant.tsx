import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { Dish } from "../../components/dish";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import {
  restaurantQeury,
  restaurantQeuryVariables,
} from "../../__generated__/restaurantQeury";

const RESTAURANT_QUERY = gql`
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}

  query restaurantQeury($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      ok
      error
    }
  }
`;

interface IRestaurantparams {
  id: string;
}

export const Restaurant = () => {
  const params = useParams<IRestaurantparams>();
  const { data, loading } = useQuery<restaurantQeury, restaurantQeuryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    },
  );

  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>();
  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const addItemToOrder = (dishId: number) => {
    setOrderItems((current) => [{ dishId, ...current }]);
  };

  console.log(orderItems);
  console.log("### restaurant page > data: ", data);

  return (
    <div>
      <Helmet>
        <title>{data?.restaurant.restaurant?.name || ""} | Number Eats</title>
      </Helmet>
      <div
        className="bg-gray-800 bg-center bg-cover py-48"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white w-3/12 py-8 pl-48">
          <h4 className="text 4xl mb-3">{data?.restaurant.restaurant?.name}</h4>
          <h5 className="text-sm font-light mb-2">
            {data?.restaurant.restaurant?.category?.name}
          </h5>
          <h6 className="text-sm font-light">
            {data?.restaurant.restaurant?.address}
          </h6>
        </div>
      </div>

      <div className="container pb-32  flex flex-col items-end mt-20">
        <button onClick={triggerStartOrder} className="btn px-10">
          Start Order
        </button>
        <div className="container grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              id={dish.id}
              orderStarted={orderStarted}
              key={index}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
            ></Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
