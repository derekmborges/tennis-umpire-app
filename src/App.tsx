import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider } from '@mui/material';
import React from 'react';
import { ManagerApp } from './components/ManagerApp';
import { MatchManagerProvider } from './providers/matchManager';

let darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
})
darkTheme = responsiveFontSizes(darkTheme)

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
