import React from 'react';
import { Button, Typography, Container, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div id="root">
      <div className="header">
        <Typography variant="h3" className="welcome">
          Welcome
        </Typography>
        <div className="homeButtons">
          <Button
            className="primary"
            variant="contained"
            onClick={() => navigate('/signup')}
          >
            Signup
          </Button>
          <Button
            className="secondary"
            variant="contained"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        </div>
      </div>
      <Container>
        {/* Additional content can go here */}
      </Container>
    </div>
  );
};

export default Home;
