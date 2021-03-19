import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";
// import { RestaurantParts } from "../../__generated__/RestaurantParts";

const RESTAURANTS_QUERY = gql`
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
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
              <Link key={category.id} to={`/category/${category.slug}`}>
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
              </Link>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-16">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                categoryName={restaurant.category?.name}
                address={restaurant.address}
              />
            ))}
          </div>
          <Pagination
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
            page={page}
            totalPages={data?.restaurants.totalPages}
          />
        </div>
      )}
    </div>
  );
};
