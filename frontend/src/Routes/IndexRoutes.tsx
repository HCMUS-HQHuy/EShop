import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromChildren,
} from "react-router-dom";
import { ROUTES_CONFIG } from "./routes.tsx";
import RequiredAuth from "./RequiredAuth.tsx";
import RoutesLayout from "./RoutesLayout.tsx";

const AppRoutes = () => {
  const routes = createRoutesFromChildren(
    <Route path="/" element={<RoutesLayout />}>
      {ROUTES_CONFIG.map(({ path, element }, index) => (
        <Route
          key={index}
          path={path}
          element={<RequiredAuth>{element}</RequiredAuth>}
        />
      ))}
    </Route>
  );

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
};

export default AppRoutes;
