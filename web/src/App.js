import * as React from 'react'
import useGoogleSheets from 'use-google-sheets'
import extractUrls from 'extract-urls'
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { KeyRounded, GitHub, Menu, Place, Search, OpenInNew } from "@mui/icons-material"
import { CssBaseline, Typography, Button, CardContent, CardActions, Card, Grid, AppBar, Toolbar, IconButton, Drawer, ListItemText, Divider, ListItem, ListItemIcon, ListItemButton, Tooltip, Box, TextField, Container } from '@mui/material'

function StyledCard(props) {
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
          {props.company}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            mb: 1.5
          }}
          color="text.secondary"
        >
          <Place sx={{ fontSize: '1rem', verticalAlign: 'middle', paddingBottom: '1%' }} /> {props.locations}
        </Typography>
        <Divider sx={{ marginTop: "2%", marginBottom: "3%" }} />
        <Typography
          variant="body1"
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
          }}
        >
          {props.roles}
        </Typography>
      </CardContent>
      <CardActions sx={{ marginTop: "auto" }}>
        {/* {props.links && props.links.map((link, idx) => (
          <Button key={idx} size="small" onClick={() => {
            window.open(link, "_blank", "noopener,noreferrer")
          }}>Link {idx + 1}</Button>
        ))} */}
        <Button size="small" onClick={() => {
          props.setSelectedJob(props)
        }}>View More</Button>
      </CardActions>
    </Card>
  )
}

const ViewMoreSlider = (props) => {
  const showSlider = props.selectedJob !== null
  return (
    <Drawer open={showSlider} anchor="right" onClose={() => { props.setSelectedJob(null) }} >
      <Box
        sx={{ width: 600, maxWidth: "80vw" }}
        role="presentation"
      >
        {showSlider && 
          <Box sx={{ "& .MuiListItemText-root": { paddingTop: "1%", paddingLeft: "1%", paddingBottom: "2%", paddingRight: "1%" } }}>
            <ListItemText
              primary={props.selectedJob.company}
              secondary={props.selectedJob.about}
              sx={{
                marginLeft: 1,
                ".MuiListItemText-primary": { fontWeight: "bold", fontSize: 30 },
              }}
            />
            <Divider />
            <ListItemText
              primary="Locations"
              secondary={props.selectedJob.locations ?? "N/A"}
              sx={{
                marginLeft: 1,
                ".MuiListItemText-primary": { fontWeight: "bold", fontSize: 14 },
              }}
            />
            <ListItemText
              primary="Vacancies"
              secondary={props.selectedJob.roles ?? "N/A"}
              sx={{
                marginLeft: 1,
                ".MuiListItemText-primary": { fontWeight: "bold", fontSize: 14 },
              }}
            />
            <ListItemText
              primary="Review"
              secondary={props.selectedJob.pros ?? "N/A"}
              sx={{
                marginLeft: 1,
                ".MuiListItemText-primary": { fontWeight: "bold", fontSize: 14 },
              }}
            />
            <ListItemText
              primary="Notes from Gergely Orosz"
              secondary={props.selectedJob.notes ?? "N/A"}
              sx={{
                marginLeft: 1,
                ".MuiListItemText-primary": { fontWeight: "bold", fontSize: 14 },
              }}
            />
            <Divider />
            {
              props.selectedJob.links.map((link, idx) => (
                <ListItem key={idx} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        window.open(link, "_blank", "noopener,noreferrer")
                      }}
                    >
                      <ListItemIcon>
                        <OpenInNew />
                      </ListItemIcon>
                      <ListItemText primary={`Open Link ${idx + 1}`} sx={{ marginLeft: "-5%" }} />
                    </ListItemButton>
                  </ListItem>
              ))
            }
          </Box>
        }
      </Box>
    </Drawer>
  )
}

const App = () => {
  const [jobs, setJobs] = React.useState([])
  const [searchedJobs, setSearchedJobs] = React.useState([])
  const [menuToggle, setMenuToggle] = React.useState(false)
  const [selectedJob, setSelectedJob] = React.useState(null)

  const toggleMenu = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return
    }
    setMenuToggle(open)
  }

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
    }
  }, [data, error, loading])

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <ViewMoreSlider selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
      <AppBar position="sticky">
        <Toolbar sx={{ height: "10vh" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleMenu(true)}
          >
            <Menu />
          </IconButton>
          <Drawer open={menuToggle} onClose={toggleMenu(false)}>
            <Box
              sx={{ width: 200 }}
              role="presentation"
              onClick={toggleMenu(false)}
              onKeyDown={toggleMenu(false)}
            >
              <ListItemText
                primary="Tech Jobs"
                secondary="Sourced from The Pragmatic Engineer"
                sx={{
                  marginLeft: 1,
                  ".MuiListItemText-primary": { fontWeight: "bold" },
                }}
              />
              <Divider />
              <Box
                sx={{
                  position: "fixed",
                  bottom: 0,
                  width: 200,
                }}
              >
                <Divider />
                <Tooltip title="GitHub">
                  <ListItem key="repository" disablePadding>
                    <ListItemButton
                      onClick={() => {
                        window.open("https://github.com/damianperera/jobs", "_blank", "noopener,noreferrer")
                      }}
                    >
                      <ListItemIcon>
                        <GitHub />
                      </ListItemIcon>
                      <ListItemText primary="Repository" />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
                <Tooltip title="MIT License">
                  <ListItem key="license" disablePadding>
                    <ListItemButton
                      onClick={() => {
                        window.open("https://github.com/damianperera/jobs/blob/main/LICENSE", "_blank", "noopener,noreferrer")
                      }}
                    >
                      <ListItemIcon>
                        <KeyRounded />
                      </ListItemIcon>
                      <ListItemText primary="License" />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              </Box>
            </Box>
          </Drawer>
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
            <Container maxWidth="sm">
              <TextField
                autoFocus
                required
                id="search"
                placeholder={`Search from ${jobs.length} community sourced jobs in tech`}
                variant="outlined"
                onChange={(event) => {
                  const text = event.target.value
                  if (text) {
                    setSearchedJobs(jobs.filter(job => Object.keys(job).some(key => typeof job[key] === 'string' && job[key].toLowerCase().includes(text.toLowerCase()))))
                  } else {
                    setSearchedJobs(jobs)
                  }
                }}
                sx={{
                  border: "1px solid rgba(81, 81, 81, 1)",
                  borderRadius: "4px",
                  width: "100%",
                  "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
                      border: 0,
                    },
                  },
                  "& .MuiInputBase-root": {
                    "& > fieldset": {
                      border: "0 !important",
                    },
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton aria-label="search" size="small">
                      <Search />
                    </IconButton>
                  ),
                }}
              />
            </Container>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ height: "100%", width: "100%", color: "black", p: 3 }}>
        <Grid display="flex" container spacing={3} columns={{ xs: 3, sm: 6, md: 12 }}>
          {searchedJobs.map(job => (
            <Grid key={job['key']} item xs={3}>
              <StyledCard {...job} setSelectedJob={setSelectedJob} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default App;
