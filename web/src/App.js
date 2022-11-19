import * as React from 'react';
import useGoogleSheets from 'use-google-sheets';
import './App.css';

const App = () => {
  const [jobs, setJobs] = React.useState([]);

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
  });

  React.useEffect(() => {
    const onlyJobs = data[0]
    if (!loading && !error) {
      setJobs(onlyJobs['data'].slice(3))
    }
  }, [ data, error, loading ])

  return (
    <div className="App">
      {JSON.stringify(jobs)}
    </div>
  );
}

export default App;
