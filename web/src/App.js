import * as React from 'react'
import useGoogleSheets from 'use-google-sheets'
import extractUrls from 'extract-urls'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Place, OpenInNew, ContentCopy } from '@mui/icons-material'
import { CssBaseline, Typography, Button, CardContent, CardActions, Card, Grid, Drawer, ListItemText, Divider, ListItem, ListItemIcon, ListItemButton, Box, CircularProgress, Stack } from '@mui/material'
import TopBar from './components/TopBar'

const isStringEmpty = (val) => {
  return (!val || val.length === 0 || !val.trim());
};

const StyledCard = (props) => {
  return (
    <Card sx={{
      height: '250px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardContent>
        <Typography
          variant='h5'
          component='div'
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {props.company}
        </Typography>
        <Typography
          variant='body2'
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            mb: 1.5
          }}
          color='text.secondary'
        >
          <Place sx={{ fontSize: '1rem', verticalAlign: 'middle', paddingBottom: '1%' }} /> {props.locations}
        </Typography>
        <Divider sx={{ marginTop: '2%', marginBottom: '3%' }} />
        <Typography
          variant='body1'
          sx={{
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {props.roles}
        </Typography>
      </CardContent>
      <CardActions sx={{ marginTop: 'auto' }}>
        <Button size='small' onClick={() => {
          props.setSelectedJob(props)
        }}>Learn More</Button>
      </CardActions>
    </Card>
  )
}

const ViewMoreSlider = (props) => {
  const showSlider = props.selectedJob !== null
  return (
    <Drawer open={showSlider} anchor='right' onClose={() => { props.setSelectedJob(null) }} >
      <Box
        sx={{ width: 600, maxWidth: '80vw' }}
        role='presentation'
      >
        {showSlider &&
          <Box sx={{ '& .MuiListItemText-root': { paddingTop: '1%', paddingLeft: '1%', paddingBottom: '2%', paddingRight: '1%' } }}>
            <ListItemText
              primary={props.selectedJob.company}
              secondary={props.selectedJob.about}
              sx={{
                marginLeft: 1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 30 },
              }}
            />
            <Divider />
            <ListItemText
              primary='Locations'
              secondary={isStringEmpty(props.selectedJob.locations) ? '-' : props.selectedJob.locations}
              sx={{
                marginLeft: 1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 14 },
              }}
            />
            <ListItemText
              primary='Vacancies'
              secondary={isStringEmpty(props.selectedJob.roles) ? '-' : props.selectedJob.roles}
              sx={{
                marginLeft: 1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 14 },
              }}
            />
            <Divider />
            <ListItemText
              primary='From the Community'
              sx={{
                marginLeft: 1,
                marginBottom: -1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 18 },
              }}
            />
            <ListItemText
              primary='Positives'
              secondary={isStringEmpty(props.selectedJob.pros) ? '-' : props.selectedJob.pros}
              sx={{
                marginLeft: 1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 14 },
              }}
            />
            <ListItemText
              primary='Comments'
              secondary={isStringEmpty(props.selectedJob.comments) ? '-' : props.selectedJob.comments}
              sx={{
                marginLeft: 1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 14 },
              }}
            />
            <Divider />
            <ListItemText
              primary='From the Curator'
              sx={{
                marginLeft: 1,
                marginBottom: -1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 18 },
              }}
            />
            <ListItemText
              primary='Notes'
              secondary={isStringEmpty(props.selectedJob.notes) ? '-' : `${props.selectedJob.notes} ~ Gergely Orosz`}
              sx={{
                marginLeft: 1,
                '.MuiListItemText-primary': { fontWeight: 'bold', fontSize: 14 },
              }}
            />
            <Divider />
            {
              props.selectedJob.links && props.selectedJob.links.map((link, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      window.open(link, '_blank', 'noopener,noreferrer')
                    }}
                  >
                    <ListItemIcon>
                      <OpenInNew />
                    </ListItemIcon>
                    <ListItemText primary={`View Vacancies ${props.selectedJob.links.length === 1 ? '' : ` - ${idx + 1}`}`} sx={{ marginLeft: '-3%' }} />
                  </ListItemButton>
                </ListItem>
              ))
            }
            <Divider />
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigator.clipboard.writeText(`https://damianperera.github.io/jobs?company=${props.selectedJob.id}`)
                }}
              >
                <ListItemIcon>
                  <ContentCopy />
                </ListItemIcon>
                <ListItemText primary={`Copy Link`} sx={{ marginLeft: '-3%' }} />
              </ListItemButton>
            </ListItem>
          </Box>
        }
      </Box>
    </Drawer>
  )
}

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
