import { gql, useMutation } from "@apollo/client";
import React from "react";
import { useParams } from "react-router";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const [createDishMutation, { loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {});
  return <h1>a</h1>;
};
