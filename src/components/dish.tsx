import React from "react";
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
  children: dishOptions,
}) => {
  // console.log({ isCustomer, options });
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeItemFromOrder) {
        return removeItemFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`h-full px-8 py-4 border cursor-pointer transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="flex items-center text-lg font-medium">
          {name}{" "}
          {orderStarted && (
            <button
              className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
                isSelected ? "bg-red-500" : " bg-lime-600"
              }`}
              onClick={onClick}
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
