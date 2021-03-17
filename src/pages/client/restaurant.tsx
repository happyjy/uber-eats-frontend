import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantQeury,
  restaurantQeuryVariables,
} from "../../__generated__/restaurantQeury";

const RESTAURANT_QUERY = gql`
  ${RESTAURANT_FRAGMENT}
  query restaurantQeury($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
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
    </div>
  );
};
