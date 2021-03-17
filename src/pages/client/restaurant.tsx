import { gql, useQuery } from "@apollo/client";
import React from "react";
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
      restaurant id: {params.id}
      <span>{data?.restaurant.restaurant?.name}</span>
    </div>
  );
};
