import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { MatchManager } from './components/MatchManager';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MatchManager />
    </ThemeProvider>
  );
}

export default App;
