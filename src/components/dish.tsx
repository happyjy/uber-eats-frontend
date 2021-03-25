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
  removeFromOrder?: (dishId: number) => void;
  addOptionToItem?: (dishId: number, option: any) => void;
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
  removeFromOrder,
  addOptionToItem,
}) => {
  // console.log({ isCustomer, options });
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`px-8 py-4 border cursor-pointer  transition-all ${
        isSelected ? "border-gray-800" : " hover:border-gray-800"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium ">
          {name}{" "}
          {orderStarted && (
            <button onClick={onClick}>{isSelected ? "Remove" : "Add"}</button>
          )}
        </h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          {options?.map((option, idx) => (
            <span
              key={idx}
              className="flex items-center"
              onClick={() => {
                addOptionToItem &&
                  addOptionToItem(id, {
                    name: option.name,
                    extra: option.extra,
                  });
              }}
            >
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};