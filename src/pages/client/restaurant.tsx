import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useParams } from "react-router-dom";
import { Dish } from "../../components/dish";
import { DishOption } from "../../components/dish-option";
import { DISH_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  createOrder,
  createOrderVariables,
} from "../../__generated__/createOrder";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import {
  restaurantQeury,
  restaurantQeuryVariables,
} from "../../__generated__/restaurantQeury";

// Items: 메뉴(dish)
// Option: 메뉴의 추가 옵션

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
      orderId
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
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const triggerStartOrder = () => {
    orderStarted ? setOrderStarted(false) : setOrderStarted(true);
  };
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  // Dish 선택
  const addItemToOrder = (dishId: number) => {
    setOrderItems((current) => [{ dishId, options: [] }, ...current]);
  };
  const removeItemFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current?.filter((dish) => dish.dishId !== dishId),
    );
  };

  // Dish의 option
  const addOptionToItem = (dishId: number, optionsName: string) => {
    if (!isSelected(dishId)) return;
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((aOption) => aOption.name == optionsName),
      );
      if (!hasOption) {
        removeItemFromOrder(dishId);
        setOrderItems((current) => [
          { dishId, options: [{ name: optionsName }, ...oldItem.options!] },
          ...current,
        ]);
      }
    }
  };
  const removeOptionFromItem = (dishId: number, optionsName: string) => {
    if (!isSelected(dishId)) return;

    const oldItem = getItem(dishId);
    if (oldItem) {
      removeItemFromOrder(dishId);
      setOrderItems((current) => [
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionsName,
          ),
          ...current,
        },
      ]);
      return;
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string,
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };

  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { ok, orderId },
    } = data;
    if (data.createOrder.ok) {
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, {
    onCompleted,
  });
  const triggerConfirmOrder = () => {
    // 중복 클릭 방지
    if (placingOrder) return;
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm("You are about to place an order");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };
  console.log("### orderItems: ", orderItems);
  console.log("### query data: ", data);

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
        <div className="bg-white xl:w-3/12 py-8 pl-48">
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
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}
        <div className="container grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurant.restaurant?.menu.map((dish, index) => (
            <Dish
              key={index}
              id={dish.id}
              description={dish.description}
              name={dish.name}
              price={dish.price}
              isCustomer={true}
              isSelected={isSelected(dish.id)}
              orderStarted={orderStarted}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeItemFromOrder={removeItemFromOrder}
            >
              {dish.options?.map((option, idx) => (
                <DishOption
                  key={idx}
                  dishId={dish.id}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  removeOptionFromItem={removeOptionFromItem}
                ></DishOption>
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
