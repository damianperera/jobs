import * as React from 'react';
import useGoogleSheets from 'use-google-sheets';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from "@mui/material/styles";

function StyledCard({ company, about, links, roles, locations, pros, comments, notes }) {
  return (
    <Card sx={{
      height: '250px',
      display: "flex",
      flexDirection: "column"
    }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {/* { about } */}
        </Typography>
        <Typography variant="h5" component="div">
          { company }
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {/* { pros } */}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            marginBottom: "3%"
          }}
        >
          { roles }
        </Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical"
          }}
        >
          Locations: { locations }
        </Typography>
      </CardContent>
      <CardActions sx={{marginTop: "auto"}}>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}

const App = () => {
  const [jobs, setJobs] = React.useState([]);

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
  });

  const darkTheme = createTheme({
		palette: {
			mode: "dark",
		},
	})

  React.useEffect(() => {
    if (!loading && !error) {
      const onlyJobs = data[0]['data'].slice(3)
      const jobs = onlyJobs.map((obj, idx) => {
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
      setJobs(jobs)
    }
  }, [ data, error, loading ])

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid container spacing={2} sx={{padding: "1%", backgroundColor: "black"}}>
        {jobs.map( job => (
          <Grid key={job['key']} item xs={3}>
            <StyledCard {...job} />
          </Grid>
        ))}
      </Grid>
    </ThemeProvider>
  );
}

export default App;
