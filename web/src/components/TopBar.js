import * as React from 'react'
import { debounce } from 'lodash'
import { KeyRounded, GitHub, Menu, Search, Add, Help, BugReport } from '@mui/icons-material'
import { AppBar, Toolbar, IconButton, Drawer, ListItemText, Divider, ListItem, ListItemIcon, ListItemButton, Tooltip, Box, TextField, Container } from '@mui/material'

const TopBar = ({ jobs, setSearchedJobs }) => {
  const [menuToggle, setMenuToggle] = React.useState(false)

  const queryParams = new URLSearchParams(window.location.search)
  const searchText = queryParams.get('q') ?? ''

  const toggleMenu = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setMenuToggle(open)
  }
  return (
    <AppBar position='sticky'>
      <Toolbar sx={{ height: '10vh' }}>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr: 2 }}
          onClick={toggleMenu(true)}
        >
          <Menu />
        </IconButton>
        <Drawer open={menuToggle} onClose={toggleMenu(false)}>
          <Box
            sx={{ width: 200 }}
            role='presentation'
            onClick={toggleMenu(false)}
            onKeyDown={toggleMenu(false)}
          >
            <ListItemText
              primary='Tech Jobs'
              secondary='Community Sourced'
              sx={{
                marginLeft: 1,
                '.MuiListItemText-primary': { fontWeight: 'bold' },
              }}
            />
            <Divider />
            <ListItem key='create-new' disablePadding>
              <ListItemButton
                onClick={() => {
                  window.open('https://docs.google.com/forms/d/e/1FAIpQLSfSCZGnIwt_yDIPdGq6o_uhj2WQjIPrU_wa0Hb4P3E6D8M3jw/viewform', '_blank', 'noopener,noreferrer')
                }}
              >
                <ListItemIcon>
                  <Add />
                </ListItemIcon>
                <ListItemText primary='Add a Company' sx={{ marginLeft: '-10%' }} />
              </ListItemButton>
            </ListItem>
            <ListItem key='about' disablePadding>
              <ListItemButton
                onClick={() => {
                  window.open('https://blog.pragmaticengineer.com/who-is-hiring-2022/', '_blank', 'noopener,noreferrer')
                }}
              >
                <ListItemIcon>
                  <Help />
                </ListItemIcon>
                <ListItemText primary='Learn More' sx={{ marginLeft: '-10%' }} />
              </ListItemButton>
            </ListItem>
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                width: 200,
              }}
            >
              <Divider />
              <Tooltip title='Report a bug'>
                <ListItem key='issues' disablePadding>
                  <ListItemButton
                    onClick={() => {
                      window.open('https://github.com/damianperera/jobs/issues', '_blank', 'noopener,noreferrer')
                    }}
                  >
                    <ListItemIcon>
                      <BugReport />
                    </ListItemIcon>
                    <ListItemText primary='Report a bug' sx={{ marginLeft: '-10%' }} />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Tooltip title='GitHub'>
                <ListItem key='repository' disablePadding>
                  <ListItemButton
                    onClick={() => {
                      window.open('https://github.com/damianperera/jobs', '_blank', 'noopener,noreferrer')
                    }}
                  >
                    <ListItemIcon>
                      <GitHub />
                    </ListItemIcon>
                    <ListItemText primary='Contribute' sx={{ marginLeft: '-10%' }} />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
              <Tooltip title='MIT License'>
                <ListItem key='license' disablePadding>
                  <ListItemButton
                    onClick={() => {
                      window.open('https://github.com/damianperera/jobs/blob/main/LICENSE', '_blank', 'noopener,noreferrer')
                    }}
                  >
                    <ListItemIcon>
                      <KeyRounded />
                    </ListItemIcon>
                    <ListItemText primary='License' sx={{ marginLeft: '-10%' }} />
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            </Box>
          </Box>
        </Drawer>
        <Box display='flex' justifyContent='center' alignItems='center' sx={{ flexGrow: 1 }}>
          <Container maxWidth='sm'>
            <TextField
              autoFocus
              required
              defaultValue={searchText && searchText}
              id='search'
              placeholder={`Search from ${jobs.length} community sourced jobs in tech`}
              variant='outlined'
              onChange={debounce((event) => {
                const text = event.target.value
                if (text) {
                  setSearchedJobs(jobs.filter(job => Object.keys(job).some(key => typeof job[key] === 'string' && job[key].toLowerCase().includes(text.toLowerCase()))))
                } else {
                  setSearchedJobs(jobs)
                }
              }, 250)
              }
              sx={{
                border: '1px solid rgba(81, 81, 81, 1)',
                borderRadius: '4px',
                width: '100%',
                '& .MuiOutlinedInput-root.Mui-focused': {
                  '& > fieldset': {
                    border: 0,
                  },
                },
                '& .MuiInputBase-root': {
                  '& > fieldset': {
                    border: '0 !important',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <IconButton aria-label='search' size='small'>
                    <Search />
                  </IconButton>
                ),
              }}
            />
          </Container>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar