import React from "react";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useParams } from "react-router";
import {
  categoryQuery,
  categoryQueryVariables,
} from "../../__generated__/categoryQuery";

const CATEGORY_QUERY = gql`
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  query categoryQuery($input: CategoryInput!) {
    category(input: $input) {
      error
      ok
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug: params.slug,
        },
      },
    },
  );
  console.log("### Category page > data: ", data);
  return <div>category view</div>;
};
