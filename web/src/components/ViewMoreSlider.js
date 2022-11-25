import * as React from 'react'
import { OpenInNew, ContentCopy } from '@mui/icons-material'
import { Drawer, ListItemText, Divider, ListItem, ListItemIcon, ListItemButton, Box } from '@mui/material'

const isStringEmpty = (val) => {
  return (!val || val.length === 0 || !val.trim());
};

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

export default ViewMoreSlider