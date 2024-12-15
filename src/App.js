import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
function App() {
    console.log('App component rendered');
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/home", replace: true }) }), _jsx(Route, { path: "/home", element: _jsx(HomePage, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) })] }) }));
}
export default App;
