import { Route } from "react-router-dom"

export const TestRoutes = <Route path="test" lazy={() => import("./Test")} />
