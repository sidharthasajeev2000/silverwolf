import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { routerBasename } from './utils/asset';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CustomPrint } from './pages/CustomPrint';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { FAQ } from './pages/FAQ';
import { Policies } from './pages/Policies';
import { NotFound } from './pages/NotFound';
import { AdminLayout } from './admin/components/AdminLayout';
import { RequireAuth } from './admin/components/RequireAuth';
import { AdminLogin } from './admin/pages/AdminLogin';
import { AdminOverview } from './admin/pages/AdminOverview';
import { AdminOrders } from './admin/pages/AdminOrders';
import { AdminProducts } from './admin/pages/AdminProducts';
import { AdminPricing } from './admin/pages/AdminPricing';

export default function App() {
  return (
    <BrowserRouter basename={routerBasename()}>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="pricing" element={<AdminPricing />} />
        </Route>

        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="shop/:slug" element={<ProductDetail />} />
          <Route path="custom" element={<CustomPrint />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="policies" element={<Policies />} />
          <Route path="home" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
