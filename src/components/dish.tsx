import React from "react";
import { restaurantQeury_restaurant_restaurant_menu_options } from "../__generated__/restaurantQeury";

// # owner, client
interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  orderStarted?: boolean;
  options?: restaurantQeury_restaurant_restaurant_menu_options[] | null;
  addItemToOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  orderStarted = false,
  options,
  addItemToOrder,
}) => {
  // console.log({ isCustomer, options });
  return (
    <div
      onClick={() =>
        orderStarted ? addItemToOrder && addItemToOrder(id) : null
      }
      className="px-8 py-4 border cursor-pointer hover:border-gray-800 transition-all"
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium ">{name}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
          {options?.map((option, idx) => (
            <span className="flex items-center" key={idx}>
              <h6 className="mr-2">{option.name}</h6>
              <h6 className="text-sm opacity-75">(${option.extra})</h6>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
