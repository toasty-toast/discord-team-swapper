import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar } from 'react-bootstrap';


const TopNav: React.FC = () => {
  return (
    <Navbar bg="primary" variant="dark">
      <div style={{ margin: 'auto' }}>
        <Navbar.Brand>Team Swapper</Navbar.Brand>
      </div>
    </Navbar>
  );
}

export default TopNav;
