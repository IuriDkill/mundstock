import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routesConfig';
import Layout from '../components/layout';

export default function AppRouter() {
  return (
    <Router>
        <Routes>
          <Route element={<Layout />}>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Route>
        </Routes>
    </Router>
  );
}
