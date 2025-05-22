import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
} from "react-bootstrap";
import { useFormik } from "formik";

import useEmailCommunication, {
  useFirmEmail,
  useSaveSelfHostedEmail,
  useGoogle,
  useOutlook
} from "../hooks/useEmailCommunication";

const CommunicationEmail = (props) => {
  const [email, setEmail] = useState(props?.data?.attorneyprofile?.mailing_email);
  const [emailChange, setEmailChange] = useState(false);

  const {
    data: emailCommData,
    loading: emailCommLoading,
    refetch,
  } = useEmailCommunication();
  const { changeEmail } = useFirmEmail();
  const { fetchGoogleLoginURL, disableGoogle } = useGoogle();
  const { fetchOutlookLoginURL, disableOutlook } = useOutlook();
  const {
    postSelfHostedEmail,
    data: postSelfHostedEmailResponse,
  } = useSaveSelfHostedEmail();

  useEffect(() => {
    if (props?.data?.attorneyprofile?.mailing_email) {
      setEmail(props?.data?.attorneyprofile?.mailing_email);
    }
  }, [props]);

  const hangleGmailLogin = async () => {
    const redirectURL = await fetchGoogleLoginURL();
    if (!redirectURL) {
      console.error("Failed to get Google Login URL");
      return;
    }
    window.open(redirectURL, "_blank");
  }

  const handleGmailDisconnect = async () => {
    const response = await disableGoogle();
    if (response) {
      refetch();
    }
  }

  const handleOutlookLogin = async () => {
    const redirectURL = await fetchOutlookLoginURL();
    if (!redirectURL) {
      console.error("Failed to get Outlook Login URL");
      return;
    }
    window.open(redirectURL, "_blank");
  }

  const handleOutlookDisconnect = async () => {
    const response = await disableOutlook();
    if (response) {
      refetch();
    }
  }

  const initialValues = {
    email_username: "",
    email_password: "",
    smtp_host: "",
    smtp_port: "25",
    ssl_tls: "SSL",
    imap_pop3_host: "",
    imap_pop3_port: "143",
    email_protocol: "IMAP"
  };

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await postSelfHostedEmail(values);
        console.log("Email Communication Saved", postSelfHostedEmailResponse);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleChangeEmail = async () => {
    if (!emailChange) {
      setEmailChange(true);
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    try {
      await changeEmail(email);
      refetch();
      setEmailChange(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="col-lg-12">
      {emailCommLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="col-sm-6 top-head">
            <Row className="pl-0 pb-2">
              <h4 className="mb-1">Firm Email Contact</h4>
            </Row>
            <Row className="pl-0 pb-2">
              <input
                id="firmmailingemailinput"
                type="text"
                className="form-control"
                placeholder="Enter Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!emailChange}
              />
            </Row>
            <Row className="pl-0 pb-2">
              <button
                className={`btn ${emailChange ? "btn-primary" : "btn-danger"}`}
                onClick={async () => {
                  await handleChangeEmail();
                }}
              >
                Change Email
              </button>
            </Row>
          </div>
          <div className="col-sm-6 top-head">
            <Row className="pl-0 pb-2">
              <h4>{emailCommData && emailCommData.is_firm_admin ? "Firm " : "Firm User "}Account:</h4>
            </Row>
            {emailCommData?.email_settings && (emailCommData.email_settings?.settings_type !== 'None' || emailCommData.email_settings?.settings_type !== undefined) ? (
              <Row className="">
                {emailCommData?.email_settings && emailCommData.email_settings?.settings_type === "GMAIL" ? (
                  <button className="btn btn-danger float-right" onClick={handleGmailDisconnect}>Disconnect Gmail</button>
                ) : (
                  <button className="btn btn-danger float-right" onClick={handleOutlookDisconnect}>Disconnect Outlook</button>
                )}
              </Row>
            ) : (
              <>
                <Row className="align-items-center">
                  <button className="btn btn-primary float-right" onClick={hangleGmailLogin}>LogIn to Gmail</button>
                  <p className="ml-2 mr-2">OR</p>
                  <button className="btn btn-primary float-left" onClick={handleOutlookLogin}>LogIn to Outlook</button>
                </Row>
              </>
            )}
          </div>
          <div id="selfhostfirmconnection" hidden>
            <Form id="selfhostemail" onSubmit={handleSubmit}>
              <Form.Group as={Row} className="align-items-center mt-2 mb-3">
                <Col>
                  <Form.Label md={2} className="text-left">
                    Email Username
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="email_username"
                    placeholder="Enter Email Address"
                    value={values.email_username}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label md={2} className="text-left">
                    {values.email_protocol === "IMAP" ? "IMAP Host" : "POP3 Host"}
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="imap_pop3_host"
                    placeholder={`Enter ${values.email_protocol === "IMAP" ? "IMAP" : "POP3"} Host`}
                    value={values.imap_pop3_host}
                    onChange={handleChange}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="align-items-center mt-2 mb-3">
                <Col>
                  <Form.Label md={2} className="text-left">
                    Email Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    name="email_password"
                    placeholder="Enter Email Password"
                    value={values.email_password}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label md={2} className="text-left">
                    {values.email_protocol === "IMAP" ? "IMAP Port" : "POP3 Port"}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="imap_pop3_port"
                    placeholder={`Enter ${values.email_protocol === "IMAP" ? "IMAP" : "POP3"} Port`}
                    value={values.imap_pop3_port}
                    onChange={handleChange}
                    required
                  >
                    {values.email_protocol === "IMAP" ? (
                      <>
                        <option value="143">143</option>
                        <option value="993">993</option>
                      </>
                    ) : (
                      <>
                        <option value="110">110</option>
                        <option value="995">995</option>
                      </>
                    )}
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="align-items-center mt-2 mb-3">
                <Col>
                  <Form.Label md={2} className="text-left">
                    SMTP Host
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="smtp_host"
                    placeholder="Enter SMTP Host"
                    value={values.smtp_host}
                    onChange={handleChange}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label md={2} className="text-left">
                    Email Protocol
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="email_protocol"
                    value={values.email_protocol}
                    onChange={handleChange}
                    required
                  >
                    <option value="IMAP">IMAP</option>
                    <option value="POP3">POP3</option>
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="align-items-center mt-2 mb-3">
                <Col>
                  <Form.Label md={2} className="text-left">
                    SMTP Port
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="smtp_port"
                    placeholder="Enter SMTP Port"
                    value={values.smtp_port}
                    onChange={handleChange}
                    required
                  >
                    <option value="25">25</option>
                    <option value="465">465</option>
                    <option value="587">587</option>
                  </Form.Control>
                </Col>
                <Col>
                  <Form.Label md={2} className="text-left">
                    SSL/TLS
                  </Form.Label>
                  <Form.Control
                    as="select"
                    type="text"
                    name="ssl_tls"
                    value={values.ssl_tls}
                    onChange={handleChange}
                    required
                  >
                    <option value="SSL">SSL</option>
                    <option value="TLS">TLS</option>
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="align-items-center mt-2 mb-3">
                <Col>
                  <button type="submit" className="btn-primary">
                    Submit
                  </button>
                </Col>
              </Form.Group>
            </Form>
          </div>
          <div id="FirmUsersTable">
            <h4 className="pt-2 pb-3">Connected Email Accounts:</h4>
            <table className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25 block-table m-r-5">
              <thead>
                <tr>
                  <th>Firm User</th>
                  <th>Connected Email</th>
                  <th>Protocol</th>
                  <th>Account</th>
                </tr>
              </thead>
              <tbody>
                {
                  emailCommData && emailCommData.connected_firm_users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center">No Connected Email Accounts</td>
                    </tr>
                  )
                }
                {emailCommData && emailCommData.connected_firm_users.map((email_settings, index) => (
                  <tr key={index}>
                    {
                      email_settings.for_firm_user ? (
                        <td>{`${email_settings.for_firm_user.first_name} ${email_settings.for_firm_user.last_name}`}</td>
                      ) : (
                        <td>{emailCommData.firm.attorneyprofile.office_name}</td>
                      )
                    }
                    <td>{email_settings.gmail_settings ?
                      email_settings.gmail_settings.email_address : email_settings.outlook_settings ?
                        email_settings.outlook_settings.email_address : email_settings.protocol_settings.email_username}</td>
                    <td>{email_settings.settings_type}</td>
                    <td>{email_settings.connected_account_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default CommunicationEmail;
