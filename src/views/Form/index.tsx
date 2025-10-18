import { Route } from "react-router"

export const FormRoutes = <Route path="form" lazy={() => import("./FormPage")} />
