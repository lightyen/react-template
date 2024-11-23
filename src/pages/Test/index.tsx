import { Route } from "react-router"

export const TestRoutes = <Route path="test" lazy={() => import("./Test")} />
