import * as React from 'react'
import useGoogleSheets from 'use-google-sheets'
import extractUrls from 'extract-urls'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline, Grid, Box, CircularProgress, Stack } from '@mui/material'
import TopBar from './components/TopBar'
import ViewMoreSlider from './components/ViewMoreSlider'
import StyledCard from './components/StyledCard'

const App = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [jobs, setJobs] = React.useState([])
  const [searchedJobs, setSearchedJobs] = React.useState([])
  const [selectedJob, setSelectedJob] = React.useState(null)

  const { data, loading, error } = useGoogleSheets({
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID,
  })

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  })

  const queryParams = new URLSearchParams(window.location.search)
  const requestedCompanyId = queryParams.get('company')
  const searchText = queryParams.get('q') ?? ''

  React.useEffect(() => {
    if (loading) {
      setIsLoading(true)
    }

    if (!loading && !error) {
      const onlyJobs = data[0]['data'].slice(3)
      const jobs = onlyJobs.map((obj, idx) => {
        const job = {}
        job['key'] = idx
        job['id'] = idx
        job['company'] = obj['Company name']
        job['about'] = obj['What does the company do, in one sentence?']
        job['links'] = extractUrls(obj['Link to position(s) hiring for'])
        job['roles'] = obj['Roles hiring for']
        job['locations'] = obj['Locations hiring in']
        job['pros'] = obj['If you work in this company: what is one thing you like about this place?']
        job['comments'] = obj['Any other comments?']
        job['notes'] = obj['Additional note from Gergely']
        return job
      })
      setJobs(jobs)
      setSearchedJobs(jobs)
      setIsLoading(false)

      if (searchText) {
        setSearchedJobs(jobs.filter(job => Object.keys(job).some(key => typeof job[key] === 'string' && job[key].toLowerCase().includes(searchText.toLowerCase()))))
      }

      if (requestedCompanyId) {
        setSelectedJob(jobs[requestedCompanyId])
      }
    }
  }, [data, error, loading, searchText, requestedCompanyId])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ViewMoreSlider selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
      <TopBar jobs={jobs} setSearchedJobs={setSearchedJobs} />
      {isLoading && (
        <Grid
          container
          spacing={0}
          direction='column'
          alignItems='center'
          justifyContent='center'
          style={{ minHeight: '100vh' }}
        >
          <Grid item xs={3}>
            <Stack
              direction='row'
              alignItems='center'
              justifyContent='center'
              gap={1}
              sx={{ paddingTop: '2%' }}
            >
              <CircularProgress size={25} /> Loading
            </Stack>
          </Grid>
        </Grid>
      )}
      <Box sx={{ height: '100%', width: '100%', color: 'black', p: 3 }}>
        <Grid display='flex' container spacing={3} columns={{ xs: 3, sm: 6, md: 12 }}>
          {searchedJobs.map(job => (
            <Grid key={job['key']} item xs={3}>
              <StyledCard {...job} setSelectedJob={setSelectedJob} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  )
}

export default App
