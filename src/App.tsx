import "./App.css";
import store from "./store/store";
import Sudoku from "./pages/Sudoku";
import { Provider } from "react-redux";
import Game2048 from "./pages/Game2048";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TicTacToe from "./pages/TicTacToe";
import MemoryMatch from "./pages/MemoryMatch";
import DotsAndBoxes from "./pages/DotsAndBoxes";
import WordSearchPage from "./pages/WordSearch";
import SlidingPuzzle from "./pages/SlidingPuzzle";
import RockPaperScissors from "./pages/RockPaperScissors";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
            <Route path="2048" element={<Game2048 />} />
            <Route path="sudoku" element={<Sudoku />} />
            <Route path="sliding-puzzle" element={<SlidingPuzzle />} />
            <Route path="dots-and-boxes" element={<DotsAndBoxes />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
