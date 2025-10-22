import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/home.jsx';
import MarketPage from '../pages/market.jsx';
import TradePage from '../pages/trade.jsx';
import ProfilePage from '../pages/profile.jsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/trade" element={<TradePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}