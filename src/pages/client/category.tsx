import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import { useParams } from "react-router";
import {
  categoryQuery,
  categoryQueryVariables,
} from "../../__generated__/categoryQuery";
import { Restaurant } from "../../components/restaurant";
import { Pagination } from "../../components/pagination";

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
  const [page, setPage] = useState(1);
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug: params.slug,
        },
      },
    },
  );
  console.log("### Category page > loading: ", loading);
  console.log("### Category page > data: ", data);
  console.log(
    "### Category page > data?.category.restaurants?: ",
    data?.category.restaurants,
  );
  return (
    <div>
      {!loading && (
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16 mx-16">
          {data?.category.restaurants?.map((restaurant) => (
            <Restaurant
              id={restaurant.id + ""}
              coverImg={restaurant.coverImg}
              name={restaurant.name}
              categoryName={restaurant.category?.name}
              address={restaurant.address}
            />
          ))}
        </div>
      )}
      <Pagination
        onPrevPageClick={onPrevPageClick}
        onNextPageClick={onNextPageClick}
        page={page}
        totalPages={data?.category.totalPages}
      />
    </div>
  );
};

/* <div className="bg-yellow-200 flex flex-col">
          <div className="bg-cover bg-center mb-3 py-28"> bg img </div>
          <div> restaurant title ( address )</div>
        </div> */
