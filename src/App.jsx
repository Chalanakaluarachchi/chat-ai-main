import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [error, setError] = useState("");

  async function generateAnswer(e) {
    e.preventDefault();
    setAnswer("");
    setError("");
    setGeneratingAnswer(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        {
          contents: [{ parts: [{ text: question }] }],
        }
      );

      setAnswer(
        response.data.candidates[0].content.parts[0].text
      );
    } catch (error) {
      console.log(error);
      setError("Sorry - Something went wrong. Please try again!");
    }

    setGeneratingAnswer(false);
  }

  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg transition-transform transform hover:scale-105">
        <a href="https://github.com/Vishesh-Pandey/chat-ai" target="_blank" rel="noopener noreferrer">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Chat Bot</h1>
          <h3 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">Ask Everthing,Answer Everthing</h3>
        </a>
        <form onSubmit={generateAnswer} className="space-y-6">
          <textarea
            required
            className="border border-gray-300 rounded-lg w-full h-40 px-4 py-2 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-colors duration-300 resize-none"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-transform transform hover:scale-105 duration-300"
            disabled={generatingAnswer}
          >
            {generatingAnswer ? "Generating..." : "Generate Answer"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
      <div className="w-full max-w-lg mt-8">
        {answer && (
          <div className="bg-white p-6 rounded-xl shadow-2xl transition-transform transform hover:scale-105">
            <ReactMarkdown className="prose lg:prose-xl">{answer}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;