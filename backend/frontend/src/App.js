import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import SalesScreen from './screens/SalesScreen';
import ChartListScreen from './screens/ChartListScreen';
import AdvanceSalesScreen from './screens/AdvanceSalesScreen';
import IncomeScreen from './screens/IncomeScreen';
import CustomerScreen from './screens/CustomerScreen';
import PieChartScreen from './screens/PieChartScreen';
import PieCustomerScreen from './screens/PieCustomerScreen';
import CombinedChartScreen from './screens/CombinedChartScreen';
import HeatmapScreen from './screens/HeatmapScreen';
import SentimentAnalysisScreen from './screens/SentimentAnalysisScreen';

function App() {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/orders/:id" element={<OrderScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/cart/:id?" element={<CartScreen />} />

            <Route path="/admin/userlist" element={<UserListScreen />} />
            <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
            <Route path="/admin/productlist" element={<ProductListScreen />} />
            <Route path="/admin/product/:id/edit" element={<ProductEditScreen />} />
            <Route path="/admin/product/:id/sales" element={<SalesScreen />} />
            <Route path="/admin/product/:id/sentiment" element={<SentimentAnalysisScreen />} />

            <Route path="/admin/productsaleschart" element={<AdvanceSalesScreen />} />
            <Route path="/admin/incomechart" element={<IncomeScreen />} />
            <Route path="/admin/customerchart" element={<CustomerScreen />} />
            <Route path="/admin/piechart" element={<PieChartScreen />} />
            <Route path="/admin/piecustomerchart" element={<PieCustomerScreen />} />
            <Route path="/admin/heatmapchart" element={<HeatmapScreen />} />
            <Route path="/admin/combined" element={<CombinedChartScreen />} />
            <Route path="/admin/orderlist" element={<OrderListScreen />} />
            <Route path="/admin/charts" element={<ChartListScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
