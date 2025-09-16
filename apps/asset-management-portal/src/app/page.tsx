import { Typography } from '@mui/material';

export default function HomePage() {
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Welcome to Electrum Internal Tools
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Select a menu item from the sidebar to get started.
      </Typography>
    </>
  );
}