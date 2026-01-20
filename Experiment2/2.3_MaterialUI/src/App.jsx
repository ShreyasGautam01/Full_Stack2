import { Button, TextField, CardContent, Card, Box, Typography } from '@mui/material';
import React, { useState } from 'react';

function MaterialUI() {
  const [name, setName] = useState("");
  return (
    <Box 
      sx={{ 
        height: '100vh', 
        width: '100vw', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#1e1e1e'
      }}
    >
      <Card sx={{ width: '400px', padding: '10px', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Material UI Components
          </Typography>

          <TextField
            id="name-field"
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ 
              marginTop: '20px',
              backgroundColor: name === "" ? '#e0e0e0' : '#1976d2',
              '&:hover': {
                backgroundColor: '#115293'
              }
            }}
            disabled={name === ""}
          >
            Submit
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
export default MaterialUI;