import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import React from 'react';
import { ManagerApp } from './components/ManagerApp';
import { MatchManagerProvider } from './providers/matchManager';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <MatchManagerProvider>
        <ManagerApp />
      </MatchManagerProvider>
    </ThemeProvider>
  );
}

export default App;
