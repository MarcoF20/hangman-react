import { Button } from '@mui/material'

export function Square ({ children, handleClick, background }) {
  return (
    <Button
      variant='contained'
      onClick={handleClick}
      sx={{
        margin: 2,
        backgroundColor: background,
        display: 'flex',
        fontSize: 24,
        '&:hover': {
          backgroundColor: background
        }
      }}
    >{children}
    </Button>
  )
}
