import React, { useEffect, useState, useRef } from "react";
import { Col, Modal, Nav, Row, Tab, Button } from "react-bootstrap";
import ClientProvidersStyles from "../../../CaseDashboard/ClientProvidersStyles";
import ContactPanelForTreatment from "../../components/ContactPanelForTreatment";
import AddRedirectedBackInvitation from "./add-redirect-invitation";
import { api_without_cancellation } from "../../../../api/api";

function InviteModalTreatment({
  show,
  handleClose,
  caseProvider,
  specialitie,
  refetchAll,
  data,
  PanelGenereateButtons,
}) {
  const origin =
    process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
  const modalBodyRef = useRef(null);
  const handleModalClose = () => {
    handleClose();
  };

  const [inviteProvider, setInviteProvider] = useState({
    providerEmail: "",
    defaultEmail: "",
  });

  const [addRedirectedBackPopup, setAddRedirectedBackPopup] = useState({
    show: false,
  });

  useEffect(() => {
    if (data?.contacts?.treatment_location?.email) {
      setInviteProvider({
        ...inviteProvider,
        defaultEmail: data?.contacts?.treatment_location?.email,
      });
    }
  }, [data]);

  const handleSendInvite = async () => {
    try {
      const res = await api_without_cancellation.post(
        `/api/treatment-opt/send_invite_to_provider/`,
        {
          email:
            inviteProvider.providerEmail === ""
              ? data?.contacts?.treatment_location?.email
              : inviteProvider.providerEmail,
          provider_id: caseProvider?.id,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }
      );
      setAddRedirectedBackPopup({
        ...addRedirectedBackPopup,
        show: true,
        location: { ...data?.contacts?.treatment_location },
        specialty: {
          ...specialitie,
        },
        email:
          inviteProvider.providerEmail === ""
            ? data?.contacts?.treatment_location?.email
            : inviteProvider.providerEmail,
      });
      setInviteProvider({
        providerEmail: "",
      });
      // refetchAll();
    } catch (error) {
      console.error("Error sending invite:", error);
    }
  };

  console.log(addRedirectedBackPopup);

  return (
    <>
      {!addRedirectedBackPopup.show && (
        <Modal
          show={show}
          onHide={handleModalClose}
          dialogClassName="max-1050 modal-dialog-centered "
          contentClassName="custom-modal-new-provider"
          size="lg"
        >
          <ClientProvidersStyles
            clientProviders={[
              {
                specialty: specialitie,
              },
            ]}
          />
          <div
            className={`has-speciality-color-${specialitie?.id}`}
            style={{ minHeight: "490px" }}
          >
            <Modal.Header className="text-center bg-speciality height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
              <span
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "25px",
                  height: "25px",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {specialitie && specialitie?.name[0]}
              </span>
              <Modal.Title
                className="mx-auto height-25  font-weight-semibold text-uppercase popup-heading-color d-flex align-items-center"
                id="modal_title"
                style={{ fontSize: "14px", fontWeight: "600" }}
              >
                Send Invite
                {caseProvider?.providerprofile_office_name
                  ? " To " + caseProvider?.providerprofile_office_name
                  : ""}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              ref={modalBodyRef}
              style={{ minHeight: "500px", padding: "0px" }}
            >
              <div className="custom-tab">
                <Tab.Container defaultActiveKey={"invitationModal"}>
                  <div className="">
                    <Tab.Content>
                      <Tab.Pane
                        eventKey="invitationModal"
                        style={{
                          scrollbarWidth: "none",
                        }}
                      >
                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div
                              className="row mx-0 align-items-center"
                              style={{
                                marginBottom: "5px",
                              }}
                            >
                              <div className="col-md-12 pl-0 text-center  pr-0">
                                <span
                                  className="text-center"
                                  style={{
                                    fontWeight: "600",
                                    color: "var(--primary-25)",
                                  }}
                                >
                                  This invitation allows the provider to connect
                                  with your organization through our secure
                                  platform. Once the invitation is accepted, you
                                  will gain access to shared tools and
                                  communication features to streamline your
                                  collaboration. Make sure the information is
                                  accurate before proceeding. The provider will
                                  receive an email notification with
                                  instructions on how to accept your invitation
                                  and get started.
                                </span>
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <Row className="mx-0">
                          <div className="p-l-5" style={{ maxWidth: "255px" }}>
                            <div
                              style={{
                                width: "fit-content",
                                maxWidth: "265px",
                              }}
                            >
                              <div
                                style={{
                                  backgroundColor: specialitie?.color,
                                  height: "25px",
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  width: "255px",
                                  paddingLeft: "5px",
                                }}
                                className="text-white "
                              >
                                {specialitie?.name}
                              </div>
                              <ContactPanelForTreatment
                                id={data?.contacts?.treatment_location?.id}
                                panel_name={"TREATMENT LOCATION"}
                                pageName={"treatment"}
                                websiteURL={
                                  data?.contacts?.treatment_location?.website
                                }
                                className="m-b-5"
                                dynamic_label={"Company Name"}
                                name={data?.contacts?.treatment_location?.name}
                                address1={
                                  data?.contacts?.treatment_location?.address1
                                }
                                address2={
                                  data?.contacts?.treatment_location?.address2
                                }
                                email={
                                  data?.contacts?.treatment_location?.email
                                }
                                phone_number={
                                  data?.contacts?.treatment_location
                                    ?.phone_number
                                }
                                city={data?.contacts?.treatment_location?.city}
                                state={
                                  data?.contacts?.treatment_location?.state
                                }
                                zip_code={
                                  data?.contacts?.treatment_location?.zip
                                }
                                fax_number={
                                  data?.contacts?.treatment_location?.fax
                                }
                                buttonData={PanelGenereateButtons}
                                genrate_doc_address="Medical Provider Location"
                                specialitie={specialitie}
                              />
                            </div>
                          </div>
                        </Row>

                        <Row
                          style={{ paddingLeft: "5px", paddingRight: "5px" }}
                          className="mx-0"
                        >
                          <Col md={12} className="p-0">
                            <div className="row mx-0 align-items-center custom-margin-bottom">
                              <div
                                className="col-md-4 height-25 p-l-0 pr-0"
                                style={{
                                  maxWidth: "350px",
                                }}
                              >
                                <input
                                  type="text"
                                  placeholder="Email: someone@providerurl.com"
                                  className="form-control height-25 p-0 p-l-5 rounded-0"
                                  onFocus={(e) => {
                                    e.target.placeholder = "";
                                    e.target.style.color = "black";
                                  }}
                                  onBlur={(e) => {
                                    e.target.placeholder =
                                      "Email: someone@providerurl.com";
                                  }}
                                  style={{ color: "var(--primary-25)" }}
                                  value={inviteProvider.providerEmail}
                                  onChange={(e) => {
                                    setInviteProvider({
                                      ...inviteProvider,
                                      providerEmail: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Tab.Pane>
                    </Tab.Content>
                  </div>
                </Tab.Container>
              </div>
            </Modal.Body>

            <Modal.Footer
              className="p-0 mt-0 padding-outside-btn-new-provider"
              style={{ borderTop: "none" }}
            >
              <Button
                className="button-padding-footer-new-provider d-flex align-items-center justify-content-center "
                variant="secondary"
                onClick={() => handleClose(false)}
              >
                Cancel
              </Button>

              <Button
                variant={
                  inviteProvider?.providerEmail === "" &&
                  inviteProvider?.defaultEmail === ""
                    ? "secondary"
                    : "success"
                }
                disabled={
                  inviteProvider?.providerEmail === "" &&
                  inviteProvider?.defaultEmail === ""
                }
                style={{
                  cursor:
                    inviteProvider?.providerEmail === "" &&
                    inviteProvider?.defaultEmail === ""
                      ? "not-allowed"
                      : "pointer",
                  minWidth: "108px",
                }}
                onClick={handleSendInvite}
                className="button-padding-footer-new-provider d-flex align-items-center justify-content-center "
              >
                Send Invite
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      )}

      {addRedirectedBackPopup.show && (
        <>
          <AddRedirectedBackInvitation
            show={addRedirectedBackPopup.show}
            handleClose={() => {
              setAddRedirectedBackPopup({
                show: false,
              });
              refetchAll();
            }}
            data={addRedirectedBackPopup}
            caseProvider={caseProvider}
          />
        </>
      )}
    </>
  );
}

export default React.memo(InviteModalTreatment);
