import { render, waitFor } from "@testing-library/react";
import { NotFound } from "../../pages/404";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

it("renders OK", async () => {
  render(
    // NotFound에서 helmet을 사용하고 있으므로 사용해야함
    <HelmetProvider>
      <Router>
        <NotFound />
      </Router>
    </HelmetProvider>,
  );

  await waitFor(() => {
    expect(document.title).toBe("Not Found | Uber Eats");
  });
});
