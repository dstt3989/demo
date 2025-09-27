import { cleanup, render } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router";
import React from "react";
import App from "./App";

afterEach(cleanup);

function renderWithRouter(
  ui,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) {
  return {
    ...render(<Router location={history.location} navigator={history}>{ui}</Router>),
    history,
  };
}

test("home", () => {
  renderWithRouter(<App />);
});
