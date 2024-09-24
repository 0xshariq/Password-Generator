import { useState } from "react";

function Password() {
  const [length, setLength] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getPassword = async () => {
    // Check if the length is valid
    const passwordLength = parseInt(length, 10);
    if (isNaN(passwordLength) || passwordLength <= 0) {
      setError("Please enter a valid length greater than 0");
      return;
    }

    setLoading(true);
    const apiUrl = `https://api.api-ninjas.com/v1/passwordgenerator?length=${length}`;
    const apiKey = 'c4N0gXW1zyrSkuVUWCdRuQ==52IOjUi1WsDoQgNp'; 

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "X-Api-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network Connection Error");
      }

      const data = await response.json();
      if (data && data.random_password) {
        setData(data);
        setError("");
      } else {
        setError("Unexpected response format");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    getPassword();
  };

  const handleReset = () => {
    setLength('');
    setData(null);
    setError("");
  };

  const handleCopy = () => {
    if (data && data.random_password) {
      navigator.clipboard.writeText(data.random_password)
        // .then(() => setError("Password copied to clipboard"))
        // .catch(() => setError("Failed to copy password"));
    }
  };

  return (
    <div className="container">
      <h1>Random Password Generator</h1>
      <input
        type="number"
        value={length}
        placeholder="Enter Password Length"
        onChange={(e) => setLength(e.target.value)}
        min="1"
        max="128" // Reasonable maximum length for passwords
      />
      <br />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}
      {data && (
        <div>
          <p className="password">Password: {data.random_password}</p>
          <button onClick={handleCopy}>Copy to Clipboard</button>
        </div>
      )}
      <br />
      <button onClick={handleSubmit} disabled={loading}>Generate Password</button>
      <button onClick={handleReset} disabled={loading}>Clear</button>
    </div>
  );
}

export default Password;
