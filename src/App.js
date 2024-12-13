import { jsx as _jsx } from "react/jsx-runtime";
import LoginPage from './pages/LoginPage/';
function App() {
    console.log('App component rendered');
    return (_jsx(LoginPage, {}));
}
export default App; // Ensure this is a default export
