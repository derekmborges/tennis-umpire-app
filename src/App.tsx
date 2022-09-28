import { createTheme, CssBaseline, responsiveFontSizes, ThemeProvider } from '@mui/material';
import React from 'react';
import { ManagerApp } from './components/ManagerApp';
import { DatabaseProvider } from './providers/databaseProvider';
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
      <DatabaseProvider>
        <MatchManagerProvider>
          <ManagerApp />
        </MatchManagerProvider>
      </DatabaseProvider>
    </ThemeProvider>
  );
}

export default App;
