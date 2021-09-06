import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import SwapConfigurator from './components/SwapConfigurator';
import TopNav from './components/TopNav';

const App: React.FC = () => {
  return (
    <Container fluid>
      <Row>
        <TopNav />
      </Row>
      <Row className="mt-3">
        <Col></Col>
        <Col lg={5}>
          <SwapConfigurator />
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default App;
