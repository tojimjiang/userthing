import './App.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from './UserList';

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<UserList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
