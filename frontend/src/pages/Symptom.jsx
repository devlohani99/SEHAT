import { useState } from "react";
import { useAIStore } from "../store/ai.store.js";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const { aiResponse, checkSymptoms, loading, error } = useAIStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.trim() === "") return alert("Please enter symptoms");
    checkSymptoms(symptoms);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Symptom Checker</h2>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="w-full p-2 border rounded-md"
            rows="3"
            placeholder="Enter symptoms (e.g., fever, cough, headache)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md mt-2 hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Checking..." : "Check Symptoms"}
          </button>
        </form>

        {/* Show AI Response */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {aiResponse && (
          <div className="mt-4 p-4 border rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold">Diagnosis:</h3>
            <p className="text-gray-700 whitespace-pre-line">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomChecker;
