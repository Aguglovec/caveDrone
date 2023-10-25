import { Navigate, Route, Routes } from 'react-router-dom';

import App from './App';
import MenuComponent from '../menu/MenuComponent';
import GameComponent from '../game/GameComponent';
import WinComponent from '../Win/WinComponent';



function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<App />}>
                <Route index element={<Navigate to="/menu" />} />
                <Route path="menu" element={<MenuComponent />} />
                <Route path="game" element={<GameComponent />} />
                <Route path="win" element={<WinComponent />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;
