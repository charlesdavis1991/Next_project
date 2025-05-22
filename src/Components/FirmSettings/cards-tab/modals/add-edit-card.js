import React, { useEffect, useState } from "react";
import { Button, Modal, Nav, Tab } from "react-bootstrap";
import { useAddCard, useEditCard } from "../hooks/useGetCardsTabAPI";

const AddEditCardModal = ({
  showModal,
  handleClose,
  data,
  refetch,
  isEdit = false,
  filledData = {},
  editId = "",
}) => {
  const [defaultTab, setDefaultTab] = useState("card-info");
  const { saveCard } = useAddCard();
  const { editCard } = useEditCard();

  const defaultMessages = {
    Christmas: "Merry Christmas!",
    Birthday: "Happy Birthday!",
    "New Year": "Happy New Year!",
    "4th of July": "Happy 4th of July!",
  };

  const [modaldata, setModalData] = useState({
    card_name: "",
    message: "",
    select_event: "",
    event_date: "",
    handwriting: "",
    handwritingName: "",
    cards: "",
    cardsName: "",
    case_type: "",
    ageRange: [],
  });

  useEffect(() => {
    if (isEdit && filledData) {
      setModalData({
        card_name: filledData?.name || "",
        message: filledData?.message || "",
        select_event: filledData?.event_id || "",
        event_date: filledData?.date ?? "",
        handwriting: filledData?.handwriting_id || "",
        cards: filledData?.template_id || "",
        case_type: filledData?.case_type || "",
        ageRange: filledData?.age_ranges || [],
      });
    }
  }, [filledData]);

  const handleAgeRangeChange = (e) => {
    const { value, checked } = e.target;

    setModalData((prev) => {
      if (value === "all") {
        if (checked) {
          return {
            ...prev,
            ageRange: ["0", "1", "2", "3", "4", "5"],
          };
        } else {
          return {
            ...prev,
            ageRange: [],
          };
        }
      } else {
        let newAgeRange;
        if (checked) {
          newAgeRange = [...prev.ageRange, value];
          const hasAllAges = ["0", "1", "2", "3", "4", "5"].every((age) =>
            newAgeRange.includes(age)
          );

          if (hasAllAges) {
            document.getElementById("ageAll").checked = true;
          }
        } else {
          newAgeRange = prev.ageRange.filter((age) => age !== value);
          document.getElementById("ageAll").checked = false;
        }

        return {
          ...prev,
          ageRange: newAgeRange,
        };
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "ageRange") {
      handleAgeRangeChange(e);
    } else {
      setModalData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleInputChangeMultipleValue = (e, nametype, nameId) => {
    const { name, value } = e.target;

    setModalData((prev) => ({
      ...prev,
      [name]: value,
      [nametype]: nameId,
    }));
  };

  const handleEventChange = (e) => {
    const selectedEventId = e.target.value;
    const selectedEvent = data?.card_events?.find(
      (event) => event.id.toString() === selectedEventId
    );

    setModalData((prev) => ({
      ...prev,
      select_event: selectedEventId,
      message:
        selectedEventId === "custom_event"
          ? ""
          : selectedEvent
            ? defaultMessages[selectedEvent.name] || ""
            : "",
    }));
  };

  const TypesOfCases = [
    {
      id: 1,
      name: "All Cases",
      value: "all",
    },
    {
      id: 2,
      name: "Open Cases",
      value: "open",
    },
    {
      id: 3,
      name: "Closed Cases",
      value: "closed",
    },
    {
      id: 4,
      name: "Manual selection of clients",
      value: "manual",
    },
  ];

  const ageRange = [
    {
      id: "ageAll",
      name: "All",
      value: "all",
    },
    {
      id: "age0",
      name: "0-19 years",
      value: "0",
    },
    {
      id: "age1",
      name: "20-29 years",
      value: "1",
    },
    {
      id: "age2",
      name: "30-39 years",
      value: "2",
    },
    {
      id: "age3",
      name: "40-49 years",
      value: "3",
    },
    {
      id: "age4",
      name: "50-59 years",
      value: "4",
    },
    {
      id: "age5",
      name: "60+ years",
      value: "5",
    },
  ];

  const handleSubmit = async () => {
    const initialPayload = {
      event: modaldata.select_event,
      date: modaldata.event_date,
      message: modaldata.message,
      card_name: modaldata.card_name,
    };

    if (isEdit) {
      (initialPayload.editSelectedHandwriting = modaldata.handwriting),
        (initialPayload.editSelectedCard = modaldata.cards),
        (initialPayload.edit_case_type = modaldata.case_type),
        (initialPayload.editageRange = modaldata.ageRange);
    } else {
      (initialPayload.selectedHandwriting = modaldata.handwriting),
        (initialPayload.selectedCard = modaldata.cards),
        (initialPayload.case_type = modaldata.case_type),
        (initialPayload.ageRange = modaldata.ageRange);
    }

    const payload = Object.entries(initialPayload).reduce(
      (acc, [key, value]) => {
        const isEmpty =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        if (!isEmpty) {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );

    try {
      if (isEdit) {
        payload.card_id = Number(editId);
        data?.handwritings.map((handwriting) => {
          if (modaldata.handwriting === handwriting.id) {
            payload.editSelectedHandwriting = `${modaldata.handwriting}-${handwriting.name}`;
          }
        });
        data?.cards.map((card) => {
          if (modaldata.cards === card.id) {
            payload.editSelectedCard = `${modaldata.cards}-${card.name}`;
          }
        });
        // payload.editSelectedHandwriting = `${modaldata.handwriting}-${modaldata.handwritingName}`;
        // payload.editSelectedCard = `${modaldata.cards}-${modaldata.cardsName}`;
        if (modaldata.case_type === "manual") {
          delete payload.editageRange;
        }
        await editCard(JSON.stringify(payload));
        handleClose();
        setModalData({
          card_name: "",
          message: "",
          select_event: "",
          event_date: "",
          handwriting: "",
          handwritingName: "",
          cards: "",
          cardsName: "",
          case_type: "",
          ageRange: [],
        });
        setDefaultTab("card-info");
        refetch();
      } else {
        payload.selectedHandwriting = `${modaldata.handwriting}-${modaldata.handwritingName}`;
        payload.selectedCard = `${modaldata.cards}-${modaldata.cardsName}`;
        if (modaldata.case_type === "manual") {
          delete payload.ageRange;
        }
        await saveCard(JSON.stringify(payload));
        handleClose();
        refetch();
        setModalData({
          card_name: "",
          message: "",
          select_event: "",
          event_date: "",
          handwriting: "",
          handwritingName: "",
          cards: "",
          cardsName: "",
          case_type: "",
          ageRange: [],
        });
        setDefaultTab("card-info");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal size="lg" show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title style={{ fontSize: "15px" }}>
          {isEdit ? "Edit Card" : "New Card"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="custom-tab mt-3">
          <Tab.Container defaultActiveKey={defaultTab} onSelect={setDefaultTab}>
            <Nav variant="tabs" className="justify-content-around">
              <Nav.Link className="" eventKey="card-info">
                1. Card Information
              </Nav.Link>

              <Nav.Link className="" eventKey="handwriting">
                2. HandWriting
              </Nav.Link>

              <Nav.Link className="" eventKey="template">
                3. Template
              </Nav.Link>
              <Nav.Link className="" eventKey="clients">
                4. Clients
              </Nav.Link>
            </Nav>
            <div className="mt-2">
              <Tab.Content>
                <Tab.Pane eventKey="card-info">
                  <div className="row">
                    <div className="form-group col d-flex flex-column">
                      <label htmlFor="card_name">Card Name:</label>
                      <input
                        type="text"
                        id="card_name"
                        name="card_name"
                        className="form-control"
                        value={modaldata.card_name}
                        onChange={(e) =>
                          setModalData((prev) => {
                            return { ...prev, card_name: e.target.value };
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col d-flex flex-column">
                      <label htmlFor="event_name">Select Event:</label>
                      <select
                        value={modaldata.select_event}
                        className="form-select"
                        onChange={handleEventChange}
                      >
                        <option value="">Select an Event</option>
                        <option value="custom_event">Custom Event</option>
                        {data?.card_events?.map((event) => (
                          <option key={event.id} value={event.id}>
                            {event.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {modaldata.select_event === "custom_event" && (
                      <div className="form-group col-md-6 d-flex flex-column">
                        <label htmlFor="event_date">Event Date:</label>
                        <input
                          type="date"
                          id="event_date"
                          name="event_date"
                          className="form-control"
                          value={modaldata.event_date}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                  <div className="row">
                    <div className="form-group col d-flex flex-column">
                      <label htmlFor="message">Message:</label>
                      <input
                        type="text"
                        id="message"
                        name="message"
                        className="form-control"
                        value={modaldata.message}
                        onChange={(e) =>
                          setModalData((prev) => {
                            return { ...prev, message: e.target.value };
                          })
                        }
                      />
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="handwriting">
                  <div className="form-group">
                    <div
                      className="hand-writing-grid d-flex align-items-center"
                      style={{ flexWrap: "wrap" }}
                    >
                      {data?.handwritings.map((handwriting) => (
                        <div
                          key={handwriting.id}
                          className="hand-writing-item"
                          style={{ width: "300px" }}
                        >
                          <img
                            src={handwriting?.preview_url}
                            alt={handwriting?.name}
                          />
                          <span className="d-flex align-items-center justify-content-center">
                            {handwriting?.name}
                            <input
                              type="radio"
                              name="handwriting"
                              className="m-l-5"
                              checked={modaldata.handwriting === handwriting.id}
                              value={handwriting.id}
                              onChange={(e) =>
                                handleInputChangeMultipleValue(
                                  e,
                                  "handwritingName",
                                  handwriting.name
                                )
                              }
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="template">
                  <div className="form-group">
                    <div
                      className="hand-writing-grid d-flex align-items-center"
                      style={{ flexWrap: "wrap", gap: "15px" }}
                    >
                      {data?.cards.map((cards) => (
                        <div
                          key={cards.id}
                          className="hand-writing-item"
                          style={{ width: "200px" }}
                        >
                          <img src={cards?.preview_url} alt={cards?.name} />
                          <span className="d-flex align-items-center justify-content-center">
                            {cards?.name}
                            <input
                              type="radio"
                              name="cards"
                              className="m-l-5"
                              value={cards.id}
                              checked={modaldata.cards === cards.id}
                              onChange={(e) =>
                                handleInputChangeMultipleValue(
                                  e,
                                  "cardsName",
                                  cards.name
                                )
                              }
                            />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="clients">
                  <div className="row align-items-start">
                    <div className="form-group col-md-6">
                      <label>Types of Cases:</label>
                      {TypesOfCases.map((item) => (
                        <div className="form-check pl-0">
                          <input
                            className="form-check mr-3"
                            type="radio"
                            name="case_type"
                            id={item.value}
                            value={item.value}
                            required=""
                            onChange={handleInputChange}
                            checked={modaldata.case_type === item.value}
                          />
                          <label className="form-check-label" for={item.value}>
                            {item.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {modaldata.case_type === "manual" ? (
                      <></>
                    ) : (
                      <div className="form-group col-md-6">
                        <label>Select Age Range:</label>
                        {ageRange.map((item) => (
                          <div className="form-check pl-0" key={item.id}>
                            <input
                              className="form-check mr-3"
                              type="checkbox"
                              name="ageRange"
                              id={item.id}
                              value={item.value}
                              checked={modaldata.ageRange.includes(item.value)}
                              onChange={handleAgeRangeChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={item.id}
                            >
                              {item.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </div>
          </Tab.Container>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit}>
          {isEdit ? "Update Card" : "Save New Card"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditCardModal;
