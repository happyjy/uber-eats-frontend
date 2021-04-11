import React, { useEffect } from "react";
import { gql, useQuery, useSubscription } from "@apollo/client";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryVoronoiContainer,
  VictoryLine,
  VictoryTooltip,
  VictoryAxis,
  VictoryLabel,
} from "victory";
import {
  DISH_FRAGMENT,
  RESTAURANT_FRAGMENT,
  ORDERS_FRAGMENT,
  FULL_ORDER_FRAGMENT,
} from "../../fragments";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { Helmet } from "react-helmet-async";
import { Dish } from "../../components/dish";
import { pendingOrders } from "../../__generated__/pendingOrders";
import { DishOption } from "../../components/dish-option";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  restaurantId: string;
}

export const MyRestaurant = () => {
  const { restaurantId } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +restaurantId,
        },
      },
    },
  );
  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION,
  );
  const history = useHistory();
  useEffect(() => {
    debugger;
    console.log("### subscriptionData changed: ", subscriptionData);
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

  console.log("### my-restaurant > data: ", data);
  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || "Loading..."} | Uber Eats
        </title>
      </Helmet>
      <div
        className="py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={{
            pathname: `/restaurants/${restaurantId}/add-dish`,
            state: {
              type: "NEW",
              id: 0,
              name: "",
              description: "",
              price: 0,
              options: [],
            },
          }}
          className=" mr-8 text-white bg-gray-800 py-3 px-10"
        >
          ADD Dish &rarr;
        </Link>
        <Link to={``} className="py-3 px-10 text-white bg-lime-700 ">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4> Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-5">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Link
                  to={{
                    pathname: `/restaurants/${restaurantId}/edit-dish`,
                    state: {
                      type: "EDIT",
                      id: dish.id,
                      name: dish.name,
                      description: dish.description,
                      price: dish.price,
                      options: dish.options,
                    },
                  }}
                >
                  <Dish
                    key={dish.id}
                    name={dish.name}
                    description={dish.description}
                    price={dish.price}
                    options={dish.options}
                  >
                    {dish.options?.map((option, idx) => (
                      <DishOption
                        key={idx}
                        dishId={dish.id}
                        isSelected={false}
                        name={option.name}
                        extra={option.extra}
                        addOptionToItem={() => {}}
                        removeOptionFromItem={() => {}}
                      ></DishOption>
                    ))}
                  </Dish>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xl font-medium">Sales</h4>
          <div className="  mt-10">
            <VictoryChart
              height={500}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryLabel
                    style={{ fontSize: 18 } as any}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 20,
                  } as any,
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
        </div>
      </div>
    </div>
  );
};
