import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useLocation, useParams } from "react-router";
import { Button } from "../../components/button";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { editDish, editDishVariables } from "../../__generated__/editDish";
import { MY_RESTAURANT_QUERY } from "../owner/my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

const EDIT_DISH_MUTATION = gql`
  mutation editDish($input: EditDishInput!) {
    editDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}
interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}
interface IDishOption {
  id: number;
  name: string;
  extra: number;
  choices: any;
  __typename?: string;
}
interface IDish {
  type?: string | undefined;
  id: number;
  name?: string;
  description?: string;
  price?: string;
  options?: IDishOption[];
}

export const AddDish = () => {
  const [number, setNumber] = useState(100);
  const [dishOptions, setDishOptions] = useState<IDishOption[]>([]);
  const [editOptionsNumberList, setEditOptionsNumberList] = useState<number[]>(
    [],
  );
  const [optionsNumberList, setOptionsNumberList] = useState<number[]>([]);
  const { restaurantId } = useParams<IParams>();
  const {
    state: {
      type: dishType,
      id: dishId,
      name,
      description,
      price,
      options: dishOptionsList,
    },
    ...rest
  } = useLocation<IDish>();

  console.log("### state : ", {
    dishType,
    dishId,
    name,
    description,
    price,
    dishOptionsList,
    rest,
  });

  useEffect(() => {
    debugger;
    if (dishOptionsList && dishOptionsList.length > 0) {
      // todo: Array 타입을 한번에 setOptionsNumber 할수 있나?
      // dishOptionsList.forEach((dishOption) => {
      //   setDishOptions(() => [dishOption]);
      // });

      dishOptionsList.forEach((dishOption) => {
        setEditOptionsNumberList((cur) => [dishOption.id, ...cur]);
      });
    }
  }, []);

  const history = useHistory();
  const [createDishMutation, { loading: createDishLoading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
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

  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<IForm>({
    mode: "onChange",
    defaultValues: {
      name,
      price,
      description,
    },
  });

  const onSubmit = () => {
    const { name, price, description, ...rest } = getValues();
    debugger;
    const optionObjects = optionsNumberList.map((theId) => ({
      id: theId,
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));

    let editOptionObjects;

    if (dishType !== "EDIT") {
      createDishMutation({
        variables: {
          input: {
            name,
            price: +price,
            description,
            restaurantId: +restaurantId,
            options: optionObjects,
          },
        },
      });
    } else if (dishType === "EDIT") {
      debugger;

      // todo: 왜 안되는지 잘 모르겟음
      // typescript 때문인것 같은데...
      // delete keyword로 삭제 할 수 있는 방법은 없는걸까?
      // dishOptionsList &&
      //   dishOptionsList.map((dishOption) => {
      //     delete dishOption?.__typename;
      //     return dishOption;
      //   });

      const newArr = dishOptionsList && [...dishOptionsList];
      const newNewArr = newArr?.map((v) => {
        const obj = {
          id: v?.id,
          name: v?.name,
          extra: v?.extra,
          choices: v?.choices,
        };
        return obj;
      });

      debugger;

      if (newNewArr && newNewArr.length > 0) {
        editOptionObjects = [...optionObjects, ...newNewArr];
      }

      editDishMutation({
        variables: {
          input: {
            name,
            price: +price,
            description,
            options: editOptionObjects,
            dishId: dishId,
          },
        },
      });
    }
    history.goBack();
  };

  const onAddOptionClick = () => {
    debugger;
    // setDishOptions({ id: Date.now(), name: "", extra: 11, choices: "" });
    // todo: dishOoptions는 접근x, optionsNumber는 접근가능 왜?
    // setDishOptions((current) => [
    //   { id: Date.now(), name: "", extra: 0, choices: "" },
    //   ...current,
    // ]);
    // setDishOptions((current) => [...current]);

    setOptionsNumberList((current) => [Date.now(), ...current]);
  };

  const onDeleteClick = (idToDelete: number) => {
    debugger;
    setOptionsNumberList((current) =>
      current.filter((id) => id !== idToDelete),
    );
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
  };
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">
        {dishType !== "EDIT" ? "Add Dish" : "Edit Dish"}
      </h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-sm grid gap-3 mt-5 w-full mb-5"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: "Name is required." })}
        />
        <input
          className="input"
          type="number"
          name="price"
          placeholder="Price"
          ref={register({ required: "Price is required." })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="Description"
          ref={register({ required: "Description is required." })}
        />

        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span
            onClick={onAddOptionClick}
            className=" cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5 bg-"
          >
            Add Dish Option
          </span>
          {optionsNumberList.length !== 0 &&
            optionsNumberList.map((id) => (
              <div key={id} className="mt-5">
                <input
                  ref={register}
                  name={`${id}-optionName`}
                  className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                  type="text"
                  placeholder="Option Name"
                />
                <input
                  ref={register}
                  name={`${id}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="Option Extra"
                />
                <span
                  className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-"
                  onClick={() => onDeleteClick(id)}
                >
                  Delete Option
                </span>
              </div>
            ))}
          {dishOptionsList?.length !== 0 &&
            dishOptionsList?.map((dishOption, idx) => (
              <div key={dishOption.id} className="mt-5">
                <input
                  ref={register}
                  name={`${dishOption.id}-optionName`}
                  className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                  type="text"
                  value={dishOption.name}
                  placeholder="Option Name"
                />
                <input
                  ref={register}
                  name={`${dishOption.id}-optionExtra`}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  value={dishOption.extra}
                  min={0}
                  placeholder="Option Extra"
                />
                <span
                  className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5 bg-"
                  onClick={() => onDeleteClick(idx)}
                >
                  Delete Option
                </span>
              </div>
            ))}
        </div>
        {dishType !== "EDIT" ? (
          <Button
            loading={createDishLoading}
            canClick={formState.isValid}
            actionText="Create Dish"
          ></Button>
        ) : (
          <Button
            loading={editDishLoading}
            canClick={formState.isValid}
            actionText="Edit Dish"
          ></Button>
        )}
      </form>
    </div>
  );
};
