import * as React from 'react';
import useGoogleSheets from 'use-google-sheets';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { KeyRounded, GitHub } from "@mui/icons-material"
import { CssBaseline, Typography, Button, CardContent, CardActions, Card, Grid, AppBar, Toolbar, IconButton, Menu, Drawer, ListItemText, Divider, ListItem, ListItemIcon, ListItemButton, Tooltip, Box, Slide, useScrollTrigger } from '@mui/material';

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
            WebkitLineClamp: 2,
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
  const [jobs, setJobs] = React.useState([])
  const [menuToggle, setMenuToggle] = React.useState(false)

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
      <CssBaseline />
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
				{/* <Drawer open={menuToggle} onClose={setMenuToggle(false)}>
          <Box
            sx={{ width: 200 }}
            role="presentation"
            onClick={setMenuToggle(false)}
            onKeyDown={setMenuToggle(false)}
          >
            <ListItemText
              primary="Home"
              secondary="Dev Homepage"
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
                    // onClick={handleRepositoryClick}
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
                    // onClick={handleLicenseClick}
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
        </Drawer> */}
				<Box display="flex" justifyContent="center" alignItems="center" sx={{ flexGrow: 1 }}>
					
				</Box>
			</Toolbar>
		</AppBar>
      <Grid container spacing={2} columns={{ xs: 3, sm: 6, md: 12 }} sx={{paddingLeft: "4%", paddingRight: "4%", paddingTop: "2%", paddingBottom: "2%", backgroundColor: "black"}}>
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
