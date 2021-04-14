import React, { useEffect, useState } from "react";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import { Link, Prompt, useHistory, useParams } from "react-router-dom";
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
import {
  deleteDish,
  deleteDishVariables,
} from "../../__generated__/deleteDish";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import { editDish, editDishVariables } from "../../__generated__/editDish";
import { EDIT_DISH_MUTATION } from "./add-dish";

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

const DELETE_DISH_MUTATION = gql`
  mutation deleteDish($input: DeleteDishInput!) {
    deleteDish(input: $input) {
      ok
      error
    }
  }
`;

// const EDIT_DISH_MUTATION = gql`
//   mutation editDish($input: EditDishInput!) {
//     editDish(input: $input) {
//       ok
//       error
//     }
//   }
// `;

interface IParams {
  restaurantId: string;
}

export const MyRestaurant = () => {
  const [clickedDishNumberList, setClickedDishNumberList] = useState<
    CreateOrderItemInput[]
  >([]);
  const [dishBoxClickMode, setDishboxClickMode] = useState<Boolean>(false);
  const [toggleAllButton, setToggleAllButton] = useState<Boolean>(true);

  const [toggleDeleteDishButton, setToggleDeleteDishButton] = useState<Boolean>(
    false,
  );
  const [toggleHideDishButton, setToggleHideDishButton] = useState<Boolean>(
    false,
  );
  // const [toggleDeleteDish, setToggleDeleteDish] = useState<Boolean>(false);
  // const [toggleHideDish, setToggleHideDish] = useState<Boolean>(false);

  const [stopNavigating, setStopNavigating] = useState<Boolean>(false);
  const [toggleDishOptions, setToggleDishOptions] = useState<Boolean>(false);
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();

  /**
   * apollo/client
   */
  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION,
  );

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

  const [deletedishMutation, { loading }] = useMutation<
    deleteDish,
    deleteDishVariables
  >(DELETE_DISH_MUTATION, {
    onCompleted: (v) => {
      onCancle();
      console.log(`### onCompleted: ${v}`);
    },
    onError: (error) => {
      console.log(`### onError: ${error}`);
    },
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });

  const [editDishMutation, { loading: editDishLoading }] = useMutation<
    editDish,
    editDishVariables
  >(EDIT_DISH_MUTATION, {
    onCompleted: (d) => {
      console.log("### d: ", d);
      onCancle();
    },
    onError: (e) => {
      console.log("### e: ", e);
    },
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });

  /**
   * life cycle
   */
  useEffect(() => {
    console.log("### subscriptionData changed: ", subscriptionData);
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData]);

  /**
   * Event
   */
  // hide dish
  const onToggleHideDish = () => {
    setToggleAllButton(false);
    setToggleHideDishButton(true);
    setDishboxClickMode(true);
    setStopNavigating(true);
  };

  const onHideDish = () => {
    // setToggleHideDishButton(!toggleDeleteDish);
    if (clickedDishNumberList.length === 0) {
      alert("click dish to hide");
      return;
    }
    clickedDishNumberList &&
      clickedDishNumberList.forEach((dishNumber) => {
        editDishMutation({
          variables: {
            input: {
              dishId: dishNumber.dishId,
              hidden: true,
            },
          },
        });
      });
  };

  // delete dish
  const addDishList = (dishId: number) => {
    setClickedDishNumberList((current) => [
      { dishId, options: [] },
      ...current,
    ]);
  };
  const onDeleteDish = () => {
    // setToggleDeleteDishButton(!toggleDeleteDish);
    if (clickedDishNumberList.length === 0) {
      alert("click dish to delete");
      return;
    }
    clickedDishNumberList &&
      clickedDishNumberList.forEach((dishNumber) => {
        deletedishMutation({
          variables: {
            input: {
              dishId: dishNumber.dishId,
            },
          },
        });
      });
  };

  // dish component click event
  const removeDishList = (dishId: number) => {
    setClickedDishNumberList((current) =>
      current?.filter((dish) => dish.dishId !== dishId),
    );
    console.log(clickedDishNumberList);
  };
  const getItem = (dishId: number) => {
    return clickedDishNumberList.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };

  // etc
  const onCancle = () => {
    debugger;
    setToggleAllButton(true);
    setToggleDeleteDishButton(false);
    setToggleHideDishButton(false);
    setStopNavigating(false);
    setClickedDishNumberList([]);
  };
  const onToggleDeleteDish = () => {
    setToggleAllButton(false);
    setToggleDeleteDishButton(true);
    setDishboxClickMode(true);
    setStopNavigating(true);
  };

  const onToggleDishOptions = () => {
    setToggleDishOptions(!toggleDishOptions);
  };

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
        <div className="flex justify-between">
          <div>
            {toggleAllButton && (
              <Link
                className="block mr-8 text-white bg-gray-800 py-3 px-10"
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
              >
                ADD Dish &rarr;
              </Link>
            )}
          </div>
          <div>
            {/* <Link to={``} className="py-3 px-10 text-white bg-lime-700 ">
              Buy Promotion &rarr;
            </Link> */}
            {/* To prevent Navigating when click dish box dom */}
            <Prompt when={!!stopNavigating} message={(location) => false} />
            {toggleAllButton && (
              <>
                <label
                  className="inline-block mr-8 py-3 px-10 text-white bg-lime-700 cursor-pointer"
                  onClick={onToggleHideDish}
                >
                  start hide Dish
                </label>
                <label
                  className="inline-block mr-8 py-3 px-10 text-white bg-lime-700 cursor-pointer"
                  onClick={onToggleDeleteDish}
                >
                  start delete Dish
                </label>
                <label
                  className="inline-block py-3 px-10 text-white bg-lime-700 cursor-pointer"
                  onClick={onToggleDishOptions}
                >
                  toggle Dish Options
                </label>
              </>
            )}
            {!toggleAllButton && toggleHideDishButton && (
              <>
                <label
                  className="inline-block mr-8 py-3 px-10 text-white bg-lime-700 cursor-pointer"
                  onClick={onHideDish}
                >
                  hide Dish
                </label>
              </>
            )}
            {!toggleAllButton && toggleDeleteDishButton && (
              <>
                <label
                  className="inline-block mr-8 py-3 px-10 text-white bg-lime-700 cursor-pointer"
                  onClick={onDeleteDish}
                >
                  delete Dish
                </label>
              </>
            )}
            {!toggleAllButton && (
              <label
                className="inline-block py-3 px-10 text-white bg-black hover:bg-black cursor-pointer"
                onClick={onCancle}
              >
                cancle
              </label>
            )}
          </div>
        </div>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4> Please upload a dish!</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-5">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Link
                  // className="bg-yellow-200"
                  key={dish.id}
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
                    id={dish.id}
                    name={dish.name}
                    description={dish.description}
                    price={dish.price}
                    options={dish.options}
                    isSelected={isSelected(dish.id)}
                    toggleDishOptions={!!toggleDishOptions}
                    clickMode={!!dishBoxClickMode}
                    addDishList={addDishList}
                    removeDishList={removeDishList}
                  >
                    {toggleDishOptions &&
                      dish.options?.map((option, idx) => (
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
