import { gql, useQuery, useSubscription } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useMe } from "../hooks/useMe";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";
import {
  orderUpdates,
  orderUpdatesVariables,
} from "../__generated__/orderUpdates";

const GET_ORDER = gql`
  ${FULL_ORDER_FRAGMENT}

  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      ok
      error
      order {
        ...FullOrderParts
      }
    }
  }
`;

const ORDER_SUBSCRIPTION = gql`
  ${FULL_ORDER_FRAGMENT}

  subscription orderUpdates($input: OrderUpdatesInput!) {
    orderUpdates(input: $input) {
      ...FullOrderParts
    }
  }
`;

interface IParams {
  id: string;
}

export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    },
  );
  // const { data: subscriptionsData } = useSubscription<
  //   orderUpdates,
  //   orderUpdatesVariables
  // >(ORDER_SUBSCRIPTION, {
  //   variables: {
  //     input: {
  //       id: +params.id,
  //     },
  //   },
  // });
  // console.log(subscriptionsData);

  useEffect(() => {
    if (data?.getOrder.ok) {
      // # subscriveToMore: query 이후 subscription을 사용하는 패턴이 많다보니 apollo client에서 미리 만들어 놓음
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdates } },
        ) => {
          console.log("# subscribeToMore > updateQuery: ");
          console.log({ prev, data });

          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [data]);

  return (
    <div className="container flex justify-center mt-32">
      <Helmet>
        <title>Order #{params.id} | Uber Eats</title>
      </Helmet>
      <div className="flex flex-col justify-center w-full max-w-screen-sm border border-gray-800 ">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="grid gap-6 p-5 text-xl">
          <div className="pt-5 border-t border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="pt-5 border-t border-gray-700">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="pt-5 py-5 border-t border-b border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          {userData?.me.role === "Client" && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === "Owner" && (
            <>
              {data?.getOrder.order?.status === "Pending" && (
                <button className="btn">Accept Order</button>
              )}
              {data?.getOrder.order?.status === "Cooking" && (
                <button className="btn">Order Cooked</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
