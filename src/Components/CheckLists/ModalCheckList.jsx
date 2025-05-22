import { Col, Container, Form, Row } from "react-bootstrap";
import RenderProgress from "./RenderProgress";
import React from "react";
import ProgressCircle from "../CheckListDashboard/ProgressCircle";

const ModalCheckList = ({ data, selectedCheck }) => {
  return (
    <Container className="check-list-div" style={{ paddingLeft: "2rem" }}>
      {data?.map((obj, index) => (
        <Row className="align-items-center my-2 " key={index}>
          <Col lg="4">
            <div className="d-flex align-items-center" style={{ gap: "10px" }}>
              <Form.Check
                className="mb-3"
                type="checkbox"
                id={`person-${index}`}
              />
              <div>{obj?.case?.id || "N/A"}</div>
              <div className="d-flex align-items-center" style={{ gap: "5px" }}>
                <img
                  src={`http://127.0.0.1:8000/${obj?.case?.for_client?.profile_pic || ""}`}
                  alt="img"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                  }}
                />
                <div>
                  <span className="fw-bold">
                    {obj?.case?.for_client?.client_user?.first_name || "N/A"}{" "}
                    {obj?.case?.for_client?.client_user?.last_name || "N/A"}
                  </span>
                  <p>
                    DOB{" "}
                    {obj?.case?.for_client?.birthday.length > 0
                      ? obj?.case?.for_client?.birthday
                      : " N/A"}
                  </p>
                </div>
              </div>
              <div>
                <div className="d-flex">
                  <img
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      objectFit: "contain",
                    }}
                    src={`http://127.0.0.1:8000${selectedCheck.image}`}
                    alt=""
                  />
                  <span className="fw-bold text-nowrap ml-2">
                    {selectedCheck.caseType}
                  </span>
                </div>
                <p>DOI {obj?.case?.incident_date || "N/A"}</p>
              </div>
            </div>
          </Col>

          <Col lg="2">
            <div className="d-flex">
              <ProgressCircle case_percentage={obj?.percentage} />
              <div className="ml-2">
                <Form.Control />
              </div>
            </div>
          </Col>
          <Col lg="3">
            {/* map the data that is missing */}
            <Form.Check
              type="checkbox"
              id={`ManagingAttorney-${index}`}
              label="Managing Attorney"
            />
          </Col>
          <Col lg="3">
            <Form.Check
              type="checkbox"
              id={`ManagingAttorney2-${index}`}
              label="Managing Attorney"
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default ModalCheckList;
