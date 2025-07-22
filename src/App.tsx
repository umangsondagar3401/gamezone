import "./App.css";
import store from "./store/store";
import Sudoku from "./pages/Sudoku";
import { Provider } from "react-redux";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TicTacToe from "./pages/TicTacToe";
import MemoryMatch from "./pages/MemoryMatch";
import RockPaperScissors from "./pages/RockPaperScissors";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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
              element={
                <div className="flex items-center justify-center bg-gray-50 p-4">
                  <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Coming Soon
                    </h2>
                    <p className="text-gray-600 mb-6">
                      We're working on something amazing! This feature will be
                      available soon.
                    </p>
                    <Link
                      to="/"
                      className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              }
            />
            <Route path="sudoku" element={<Sudoku />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
