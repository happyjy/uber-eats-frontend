import { render } from "@testing-library/react";
import { FormError } from "../form-error";

// describe 공식문서에서 가능은하나 추천하지 안는다고 해서 뺌
// describe("<FormError/>", () => {
it("render OK with props", () => {
  const { getByText } = render(<FormError errorMessage="test" />);
  getByText("test");
});
// });
