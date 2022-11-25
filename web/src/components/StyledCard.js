import * as React from 'react'
import { Place } from '@mui/icons-material'
import { Typography, Button, CardContent, CardActions, Card, Divider } from '@mui/material'

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

export default StyledCard