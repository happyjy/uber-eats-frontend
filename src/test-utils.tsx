import React from "react";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
// import { Router } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

// 테스트시 render를 사용하는 모든 곳에서 HelmemtProvider, Router를 사용할 수 있도록 수정
const AllTheProviders: React.FC = ({ children }) => {
  return (
    <HelmetProvider>
      <Router>{children}</Router>
    </HelmetProvider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
