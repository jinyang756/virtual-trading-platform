import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/home.jsx';
import MarketPage from '../pages/market.jsx';
import TradePage from '../pages/trade.jsx';
import ProfilePage from '../pages/profile.jsx';
import FundsPage from '../pages/funds.jsx';
import ContractMarketPage from '../pages/contract-market.jsx';
import OptionMarketPage from '../pages/option-market.jsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/trade" element={<TradePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/funds" element={<FundsPage />} />
        <Route path="/contract-market" element={<ContractMarketPage />} />
        <Route path="/option-market" element={<OptionMarketPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}