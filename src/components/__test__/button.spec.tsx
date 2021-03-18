import { render } from "@testing-library/react";
import { Button } from "../button";

test("should render OK with props", () => {
  const { getByText } = render(
    <Button canClick={true} loading={false} actionText={"test"} />,
  );
  getByText("test");
});

test("should display loading", () => {
  const { getByText, container } = render(
    <Button canClick={false} loading={true} actionText={"test"} />,
  );
  getByText("Loading...");
  expect(container.firstChild).toHaveClass("pointer-events-none");
});
