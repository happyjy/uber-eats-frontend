import React from "react";
import { HiddenType } from "../__generated__/globalTypes";
import { restaurantQeury_restaurant_restaurant_menu_options } from "../__generated__/restaurantQeury";

// # owner, client
interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  isSelected?: boolean;
  orderStarted?: boolean;
  options?: restaurantQeury_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
  removeItemFromOrder?: (dishId: number) => void;
  toggleDishOptions?: boolean;
  clickMode?: boolean;
  addDishList?: (dishId: number) => void;
  removeDishList?: (dishId: number) => void;
  hiddenType: boolean;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  isSelected,
  orderStarted = false,
  options,
  addItemToOrder,
  removeItemFromOrder,
  toggleDishOptions = false,
  clickMode = false,
  addDishList,
  removeDishList,
  hiddenType,
  children: dishOptions,
}) => {
  const onClickContainer = () => {
    if (clickMode) {
      if (isSelected && removeDishList) {
        return removeDishList(id);
      }
      if (!isSelected && addDishList) {
        return addDishList(id);
      }
    }
  };
  const onClickButton = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeItemFromOrder) {
        return removeItemFromOrder(id);
      }
    }
  };

  // drag & drop
  const onDishDrag = (e: any) => {
    e.dataTransfer.setData("targetId", e.target.id);
    let dragOrderContainerDom = e.target;
    while (dragOrderContainerDom?.id.indexOf("dishOrderContainer") < 0) {
      dragOrderContainerDom = dragOrderContainerDom.parentNode;
    }
    e.dataTransfer.setData("dragOrder", dragOrderContainerDom.id.split("|")[1]);
  };

  return (
    <div
      id={`dishIdContainer|${id}`}
      draggable="true"
      onDragStart={onDishDrag}
      className={`h-full px-8 py-4 border
      ${!hiddenType ? "transition-all cursor-pointer" : "bg-gray-200"}
      ${isSelected ? "border-gray-800" : "hover:border-gray-800"} `}
      onClick={onClickContainer}
    >
      <div className="mb-5">
        <h3 className="flex items-center text-lg font-medium">
          {name}{" "}
          {orderStarted && (
            <button
              className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                isSelected ? "bg-red-500" : " bg-lime-600"
              }`}
              onClick={onClickButton}
            >
              {isSelected ? "Remove" : "Add"}
            </button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {/* {isCustomer && options && options?.length !== 0 && ( */}
      {toggleDishOptions && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          <div className="grid gap-2 justify-start">{dishOptions}</div>
        </div>
      )}
    </div>
  );
};
