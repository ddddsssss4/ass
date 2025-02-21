import { useState } from 'react';
import './App.css';

const API_URL = 'https://backend-oa-wu0n.onrender.com/bfhl';

export default function App() {
  const [inputData, setInputData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e) => {
    console.log('handleSubmit');
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate JSON input
      const parsedData = JSON.parse(inputData);
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid input format. Expected {"data": [...]}');
      }

      // Make API call
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: inputData,
      });

      const data = await res.json();
      if (!data.is_success) {
        throw new Error(data.error || 'API request failed');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    let output = [];
    
    if (selectedFilters.includes('Numbers')) {
      output.push(
        <div key="numbers" className="filtered-item">
          Numbers: {response.numbers.join(',')}
        </div>
      );
    }
    
    if (selectedFilters.includes('Alphabets')) {
      output.push(
        <div key="alphabets" className="filtered-item">
          Alphabets: {response.alphabets.join(',')}
        </div>
      );
    }
    
    if (selectedFilters.includes('Highest Alphabet')) {
      output.push(
        <div key="highest" className="filtered-item">
          Highest Alphabet: {response.highest_alphabet.join(',')}
        </div>
      );
    }

    return output.length > 0 ? (
      <div className="filtered-response">
        <div className="filtered-title">Filtered Response</div>
        {output}
      </div>
    ) : null;
  };

  return (
    <div className="container">
      <div className="app-wrapper">
        <form onSubmit={handleSubmit} className="form">
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="input-textarea"
            placeholder='{"data": ["M","1","334","4","B"]}'
          />
          <button
            type="submit"
            onSubmit={handleSubmit}
            disabled={isLoading}
            className={`submit-button ${isLoading ? 'disabled' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {response && (
          <div className="filter-section">
            <div className="multi-filter">
              <div className="filter-title">Multi Filter</div>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    value="Numbers"
                    checked={selectedFilters.includes('Numbers')}
                    onChange={(e) => {
                      setSelectedFilters(prev => 
                        e.target.checked 
                          ? [...prev, e.target.value]
                          : prev.filter(f => f !== e.target.value)
                      );
                    }}
                  />
                  Numbers
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    value="Alphabets"
                    checked={selectedFilters.includes('Alphabets')}
                    onChange={(e) => {
                      setSelectedFilters(prev => 
                        e.target.checked 
                          ? [...prev, e.target.value]
                          : prev.filter(f => f !== e.target.value)
                      );
                    }}
                  />
                  Alphabets
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    value="Highest Alphabet"
                    checked={selectedFilters.includes('Highest Alphabet')}
                    onChange={(e) => {
                      setSelectedFilters(prev => 
                        e.target.checked 
                          ? [...prev, e.target.value]
                          : prev.filter(f => f !== e.target.value)
                      );
                    }}
                  />
                  Highest Alphabet
                </label>
              </div>
            </div>
            {renderFilteredResponse()}
          </div>
        )}
      </div>
    </div>
  );
}
