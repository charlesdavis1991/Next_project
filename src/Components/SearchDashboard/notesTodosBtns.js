import React, { useEffect, useState } from "react";

const NotesTodosBtns = ({
  onClickSaveNotes,
  onClickCritical,
  onClickUpdate,
  onClickTask,
  onClickEvent,
  checkedRenderingPreferences,
  sortOrder,
}) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [buttonStyles, setButtonStyles] = useState({});
  const [containerStyle, setContainerStyle] = useState({});
  const [eventButtonStyle, setEventButtonStyle] = useState({});
  const [saveButtonStyle, setSaveButtonStyle] = useState({});
  const [criticalButtonStyle, setCriticalButtonStyle] = useState({});
  const [updateButtonStyle, setUpdateButtonStyle] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const numberOfItems = checkedRenderingPreferences?.reduce((count, pref) => {
      const prefKey = Object.keys(pref)[0];
      return sortOrder.includes(prefKey) ? count + 1 : count;
    }, 0);

    const calculateStyles = () => {
      if (windowWidth <= 930) {
        return {
          button: {},
          container: {},
          eventButton: {},
        };
      }
      let btnHeight = 42;
      let btnWidth = 80;
      let marginRight = -5;
      let eventBtnPaddingRight = 8;
      let saveBtnMarginLeft = -1;
      let criticalButtonMarginLeft = -15;
      let updateButtonMarginLeft = -6;

      // For 7 and 6 items
      if ([8, 7].includes(numberOfItems)) {
        if (windowWidth <= 1570 && windowWidth >= 1390) {
          btnHeight = 63;
          btnWidth = 80;
          marginRight = -7;
          eventBtnPaddingRight = 11;
        } else if (windowWidth <= 1390 && windowWidth >= 1218) {
          btnHeight = 84;
          btnWidth = 80;
          marginRight = -9;
          eventBtnPaddingRight = 15;
        } else if (windowWidth <= 1218 && windowWidth >= 930) {
          btnHeight = 105;
          btnWidth = 80;
          marginRight = -11;
          eventBtnPaddingRight = 19;
        }
      }

      // For 5 and 4 items
      else if ([6, 5].includes(numberOfItems)) {
        if (windowWidth <= 1390 && windowWidth >= 1218) {
          btnHeight = 63;
          btnWidth = 80;
          marginRight = -7;
          eventBtnPaddingRight = 11;
        } else if (windowWidth <= 1218 && windowWidth >= 930) {
          btnHeight = 84;
          btnWidth = 80;
          marginRight = -9;
          eventBtnPaddingRight = 15;
        }
      }

      // For 3 and 2 items
      else if ([4, 3].includes(numberOfItems)) {
        if (windowWidth <= 1218 && windowWidth >= 930) {
          btnHeight = 63;
          btnWidth = 80;
          marginRight = -7;
          eventBtnPaddingRight = 11;
        }
      }

      return {
        button: {
          height: `${btnHeight}px`,
          width: `${btnWidth}px`,
        },
        container: {
          marginRight: `${marginRight}px`,
        },
        eventButton: {
          paddingRight: `${eventBtnPaddingRight}px`,
        },
        saveBtn: {
          marginLeft: `${saveBtnMarginLeft}px`,
        },
        criticalButton: {
          marginLeft: `${criticalButtonMarginLeft}px`,
        },
        updateButton: {
          marginLeft: `${updateButtonMarginLeft}px`,
        },
      };
    };

    const styles = calculateStyles();
    setButtonStyles(styles.button);
    setEventButtonStyle(styles.eventButton);
    setSaveButtonStyle(styles.saveBtn);
    setCriticalButtonStyle(styles.criticalButton);
    setUpdateButtonStyle(styles.updateButton);
    setContainerStyle(styles.container);
  }, [windowWidth, checkedRenderingPreferences, sortOrder]);

  const baseButtonStyle = {
    ...buttonStyles,
    justifyContent: "center",
  };

  const eventButtonStyle2 = {
    ...baseButtonStyle,
    ...eventButtonStyle,
    transform: "skewX(var(--skew-angle))",
    clipPath: "none",
    marginLeft: "0px",
    paddingLeft: "0px",
  };

  return (
    <div className="action-btn-container" style={containerStyle}>
      <button
        className="todo-action-btn save-note-btn save-note-btn-0field"
        onClick={onClickSaveNotes}
        style={baseButtonStyle}
      >
        <span>Save</span>
        <span style={saveButtonStyle}>Note</span>
      </button>

      <button
        className="todo-action-btn critical-note-btn"
        onClick={onClickCritical}
        style={baseButtonStyle}
      >
        <span>Critical</span>
        <span style={criticalButtonStyle}>Note</span>
      </button>

      <button
        className="todo-action-btn update-status-btn"
        onClick={onClickUpdate}
        style={baseButtonStyle}
      >
        <span>Update</span>
        <span style={updateButtonStyle}>Status</span>
      </button>

      <button
        className="todo-action-btn task-btn"
        onClick={onClickTask}
        style={baseButtonStyle}
      >
        <span className="text-gold">+</span> <span>Task</span>
      </button>

      <button
        className="todo-action-btn event-btn"
        onClick={onClickEvent}
        style={eventButtonStyle2}
      >
        <span className="text-gold">+</span> <span>Event</span>
      </button>
    </div>
  );
};

export default NotesTodosBtns;
