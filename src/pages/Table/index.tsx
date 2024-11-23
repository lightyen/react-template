import { Route } from "react-router"

export const TableRoutes = <Route path="table" lazy={() => import("./Table")} />
