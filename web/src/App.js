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
    if (!loading && !error) {
      const onlyJobs = data[0]['data'].slice(3).map((obj, idx) => {
        const job = {}
        job['key'] = idx
        job['company'] = obj['Company name']
        job['about'] = obj['What does the company do, in one sentence?']
        job['links'] = obj['Link to position(s) hiring for']
        job['roles'] = obj['Roles hiring for']
        job['locations'] = obj['Locations hiring in']
        job['pros'] = obj['If you work in this company: what is one thing you like about this place?']
        job['comments'] = obj['Any other comments?']
        job['notes'] = obj['Additional note from Gergely']
        return job
      })
      setJobs(onlyJobs)
    }
  }, [ data, error, loading ])

  return (
    <div className="App">
      {jobs.map( job => (<li>{JSON.stringify(job)}</li>))}
    </div>
  );
}

export default App;
