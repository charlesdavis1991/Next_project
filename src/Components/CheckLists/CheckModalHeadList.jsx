import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import RenderProgress from "./RenderProgress";
import ProgressCircle from "../CheckListDashboard/ProgressCircle";
const CheckModalHeadList = ({ selectedCheck }) => {
  const firstList = ["Managing Attorney", "Case Assistant", "Attorney"];

  const secondList = [
    "Intake",
    "Case Manager",
    "Litigating Attorney",
    "Supervising Attorney",
  ];
  return (
    <Container className=" check-list-div" style={{ paddingLeft: "2rem" }}>
      <Row className="align-items-center">
        <Col lg="4">
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <Form.Check className="mb-3" type="checkbox" id="first" />
            <div>Assign Task to All Cases Listed Here </div>
          </div>
        </Col>

        <Col lg="2">
          <div className="d-flex">
            <ProgressCircle case_percentage={selectedCheck.percentage} />
            <div className="ml-2">
              <Form.Control />
            </div>
          </div>
        </Col>

        <Col lg="3">
          {firstList.map((list, index) => (
            <Form.Check
              className="my-2"
              key={index}
              type="checkbox"
              id={list}
              label={list}
            />
          ))}
        </Col>
        <Col lg="3">
          {secondList.map((list, index) => (
            <Form.Check
              className="my-2"
              key={index}
              type="checkbox"
              id={list}
              label={list}
            />
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default CheckModalHeadList;
