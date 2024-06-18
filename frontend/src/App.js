import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes, privateRoutes } from "./routes";
import "./assets/icons/fontawesome-free-6.4.2-web/css/all.css";
import Authentication from "./Authentication";
import NotFound from "./pages/NotFound";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { LoginedContext } from "./hooks/useContext/LoginedContext";

function App() {
  const { statusLogined } = useContext(LoginedContext);
  return (
    <Router>
      <div className="App">
        <Routes>
          {statusLogined
            ? privateRoutes.map((route, index) => {
                let Page = route.component;
                let childRoutes = route.child || [];
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <>
                        <Authentication role={route?.role}>
                          <Page />
                        </Authentication>
                      </>
                    }
                  >
                    {childRoutes.map((items, index) => {
                      let ChildPage = items.component || [];
                      return (
                        <Route
                          key={index}
                          path={items.path}
                          element={<ChildPage />}
                        />
                      );
                    })}
                  </Route>
                );
              })
            : publicRoutes.map((route, index) => {
                let Page = route.component;
                let childRoutes = route.child || [];
                return (
                  <Route key={index} path={route.path} element={<Page />}>
                    {childRoutes.map((items, index) => {
                      let ChildPage = items.component;
                      return (
                        <Route
                          key={index}
                          path={items.path}
                          element={<ChildPage />}
                        />
                      );
                    })}
                  </Route>
                );
              })}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
library.add(fas);
