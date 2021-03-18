import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Restaurant } from "../restaurant";

it("redner OK with props", () => {
  const restaurantProps = {
    id: "1",
    name: "name",
    categoryName: "categoryName",
    coverImg: "tempImgAddr",
    address: "주소",
  };

  const { getByText, container } = render(
    <Router>
      <Restaurant {...restaurantProps} />
    </Router>,
  );
  getByText(restaurantProps.name);
  getByText(restaurantProps.categoryName);
  expect(container.firstChild).toHaveAttribute(
    "href",
    `/restaurants/${restaurantProps.id}`,
  );
});
