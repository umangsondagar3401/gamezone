import "./App.css";
import store from "./store/store";
import Sudoku from "./pages/Sudoku";
import { Provider } from "react-redux";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TicTacToe from "./pages/TicTacToe";
import MemoryMatch from "./pages/MemoryMatch";
import RockPaperScissors from "./pages/RockPaperScissors";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WordSearchPage from "./pages/WordSearch";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tic-tac-toe" element={<TicTacToe />} />
            <Route path="rock-paper-scissors" element={<RockPaperScissors />} />
            <Route path="memory-match" element={<MemoryMatch />} />
            <Route path="word-search" element={<WordSearchPage />} />
            <Route
              path="puzzle-game"
              element={<div className="text-center">puzzle-game</div>}
            />
            <Route path="sudoku" element={<Sudoku />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
