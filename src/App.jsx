import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import "./index.css"
import Home from './components/Home';



function App() {

  return (
    <Router>
      <div>

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
   

  );
}

export default App;
