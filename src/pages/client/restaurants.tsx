import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Restaurant } from "../../components/restaurant";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
// import { RestaurantParts } from "../../__generated__/RestaurantParts";

const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        # id
        # name
        # coverImg
        # category {
        #   name
        # }
        # address
        # isPromoted
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface IFormProps {
  searchTerm: string;
}

export const Restaurants = () => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const { register, handleSubmit, getValues } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`,
    });
  };
  // console.log("### restaurants: ", data);
  return (
    <div>
      <Helmet>
        <title>Home | Uber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex justify-center items-center"
      >
        <input
          ref={register({ required: true, min: 3 })}
          name="searchTerm"
          type="Search"
          className="input rounded-md border-0 w-3/4 md:w-3/12"
          placeholder="Search restaurants..."
        ></input>
      </form>
      {!loading && (
        <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
          {/* mx-auto: justify-around 사용시 하위 dom 가운데 정렬 적용 */}
          <div className="flex justify-around max-w-5xl mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <div
                key={category.id}
                className="flex flex-col group items-center cursor-pointer"
              >
                <div
                  className="w-16 h-16 bg-cover rounded-full group-hover:bg-gray-200"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="mt-1 text-sm text-center font-medium ">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="bg-yellow-300 max-w-md grid grid-cols-3 text-center mx-auto mt-10">
            {page > 1 ? (
              <button onClick={onPrevPageClick} className="">
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              {" "}
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button onClick={onNextPageClick} className="">
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
