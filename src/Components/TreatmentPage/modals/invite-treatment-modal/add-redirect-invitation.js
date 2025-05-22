import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import ContactPanel from "../../../common/ContactPanel";

const AddRedirectedBackInvitation = ({
  show,
  handleClose,
  data,
  caseProvider,
}) => {
  const [timer, setTimer] = useState(5);
  console.log(show);
  useEffect(() => {
    let interval;

    if (show) {
      setTimer(5);
      interval = setInterval(() => {
        setTimer((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            handleClose();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [show, handleClose]);

  if (!show) return null;

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-dialog-centered "
        contentClassName="custom-modal-new-provider"
        size="md"
      >
        <div>
          <Modal.Header className="text-center height-25 p-0 bg-primary-fixed popup-heading-color justify-content-center">
            <Modal.Title
              className="mx-auto height-25 font-weight-semibold text-uppercase popup-heading-color font-weight-500"
              id="modal_title"
              style={{ fontSize: "14px" }}
            >
              Invitation Sent
              {caseProvider?.providerprofile_office_name
                ? " To " + caseProvider?.providerprofile_office_name
                : ""}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0 p-t-5 d-flex align-items-center justify-content-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <div
                className="d-flex flex-column"
                style={{ width: "255px", gap: "5px" }}
              >
                <div
                  style={{
                    background: data?.specialty?.color,
                    color: "white",
                    fontWeight: "600",
                  }}
                  className="d-flex height-25 align-items-center "
                >
                  <span
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      height: "25px",
                      width: "25px",
                      fontWeight: "600",
                      marginRight: "5px",
                    }}
                  >
                    {data?.specialty?.name[0]}
                  </span>
                  {data?.specialty?.name}
                </div>
                <ContactPanel
                  panel_name={"TREATMENT LOCATION"}
                  pageName={"treatment"}
                  websiteURL={data?.location?.website}
                  className="m-b-5"
                  dynamic_label={"Company Name"}
                  name={data?.name}
                  address1={data?.location?.address}
                  address2={data?.location?.address2}
                  email={data?.location?.email}
                  phone_number={data?.location?.phone}
                  city={data?.location?.city}
                  state={data?.location?.state}
                  zip_code={data?.location?.post_code}
                  fax_number={data?.location?.fax}
                  buttonData={[
                    {
                      iconClassName: "ic ic-19 ic-generate-document",
                      buttonText: "Generate Document",
                      className: "p-l-6 p-r-5",
                      style: { height: "25px" },
                      onClick: (id, name) => {},
                    },
                  ]}
                />
              </div>
              <span
                style={{
                  fontWeight: "600",
                  color: "var(--primary)",
                }}
                className="m-t-5 whitespace-nowrap"
              >
                An invitation has been sent to the provider.
              </span>
              <span
                style={{
                  fontWeight: "600",
                  color: "var(--primary)",
                }}
                className="whitespace-nowrap"
              >
                Popup will automatically close in {timer} seconds...
              </span>
            </div>
          </Modal.Body>

          <Modal.Footer
            className=" p-0 mt-0 padding-outside-btn-new-provider"
            style={{ borderTop: "none" }}
          >
            <Button
              className="button-padding-footer-new-provider mx-auto d-flex align-items-center justify-content-center "
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default AddRedirectedBackInvitation;
