import { Button } from '@mui/material'

export function Square ({ children, handleClick, background, disabled }) {
  return (
    <Button
      variant='contained'
      disabled={disabled}
      onClick={handleClick}
      sx={{
        margin: 2,
        fontSize: 24,
        backgroundColor: background,
        color: 'white',
        '&:hover': {
          backgroundColor: background
        },
        '&.Mui-disabled': {
          backgroundColor: background,
          color: 'white'
        }
      }}
    >
      {children}
    </Button>
  )
}
