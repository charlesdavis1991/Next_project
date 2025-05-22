import React from "react";
import { Card, Button, Container, Row, Col } from "react-bootstrap";

const CopilotFirmsPanel = () => {
  // Placeholder data for demonstration
  const placeholderFirms = [
    {
      id: 1,
      name: "Law Firm Name 1",
      address1: "123 Legal Street",
      address2: "Suite 100",
      city: "New York",
      state: "NY",
      zip: "10001",
      phone: "(212) 555-1234",
      fax: "(212) 555-5678",
      email: "contact@lawfirm1.com",
      website: "www.lawfirm1.com",
      contacts: ["Firm Contact 1", "Firm Contact 2", "Firm Contact 3"],
    },
    {
      id: 2,
      name: "Law Firm Name 2",
      address1: "456 Justice Avenue",
      address2: "Floor 5",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      phone: "(312) 555-1234",
      fax: "(312) 555-5678",
      email: "contact@lawfirm2.com",
      website: "www.lawfirm2.com",
      contacts: ["Firm Contact 1", "Firm Contact 2", "Firm Contact 3"],
    },
    {
      id: 3,
      name: "Law Firm Name with a Very Long Name That Needs to Wrap",
      address1: "789 Constitution Boulevard",
      address2: "Building B",
      city: "Los Angeles",
      state: "CA",
      zip: "90001",
      phone: "(213) 555-1234",
      fax: "(213) 555-5678",
      email: "contact@lawfirm3.com",
      website: "www.lawfirm3.com",
      contacts: ["Firm Contact 1", "Firm Contact 2", "Firm Contact 3"],
    },
  ];

  const cardStyle = {
    width: "255px",
    height: "347px",
    margin: "10px",
    padding: "5px",
  };

  const firmNameStyle = {
    height: "25px",
    fontSize: "16px",
    fontWeight: "bold",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  };

  const longFirmNameStyle = {
    minHeight: "25px",
    fontSize: "16px",
    fontWeight: "bold",
    textOverflow: "ellipsis",
    whiteSpace: "normal",
  };

  const addressStyle = {
    fontSize: "14px",
    margin: "0",
  };

  const contactStyle = {
    fontSize: "14px",
    margin: "2px 0",
  };

  const buttonStyle = {
    height: "25px",
    width: "245px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    marginBottom: "5px",
    margionTop: "auto",
  };

  const iconPlaceholderStyle = {
    height: "32px",
    width: "100%",
    backgroundColor: "#f0f0f0",
    marginBottom: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    color: "#888",
  };

  return (
    <div className="copilot-firms-panel">
      <Container fluid className="bg-primary-4">
        <Row>
          {placeholderFirms.map((firm) => (
            <Col
              key={firm.id}
              xs={12} // 1 card per row
              sm={6} // 2 cards per row
              md={4} // 3 cards per row
              lg={3} // 4 cards per row
              xl={2} // 6 cards per row on (1898px width)
              className="d-flex justify-content-center mb-3"
            >
              <Card style={cardStyle} className="width-255 height-347 overflow-scroll">
                <div style={iconPlaceholderStyle}>
                  <img
                    src="/BP_resources/images/silverthorne-logo.png"
                    alt="Firm Logo"
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
                <div
                  style={
                    firm.name.length > 30 ? longFirmNameStyle : firmNameStyle
                  }
                >
                  {firm.name}
                </div>
                <p style={addressStyle}>{firm.address1}</p>
                <p style={addressStyle}>{firm.address2}</p>
                <p style={addressStyle}>
                  {firm.city}, {firm.state} {firm.zip}
                </p>
                <p style={addressStyle}>{firm.phone}</p>
                <p style={addressStyle}>{firm.fax}</p>
                <p style={addressStyle}>{firm.email}</p>
                <p style={addressStyle}>{firm.website}</p>
                <Button variant="primary" style={buttonStyle}>
                  Click to Chat with Firm
                </Button>
                {firm.contacts.map((contact, index) => (
                  <p key={index} style={contactStyle}>
                    {contact}
                  </p>
                ))}
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default CopilotFirmsPanel;
