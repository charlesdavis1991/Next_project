import React, { useEffect, useState } from "react";
import { FormProvider, useFormContext } from "react-hook-form";

function DocPageTabModal({
  allTabCurrent,
  unsortedTabCurrent,
  associatedTabCurrent,
  lastTabCurrent,
}) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const [selected, setSelected] = useState(null);

  // Effect to set the selected state based on populated fields
  useEffect(() => {
    if (allTabCurrent) {
      setSelected(1);
      setValue("DocPageAll", true);
      setValue("DocPageUnsorted", false);
      setValue("DocPagePrior", false);
      setValue("DocTabForPage", false);
    } else if (unsortedTabCurrent) {
      setSelected(2);
      setValue("DocPageAll", false);
      setValue("DocPageUnsorted", true);
      setValue("DocPagePrior", false);
      setValue("DocTabForPage", false);
    } else if (associatedTabCurrent) {
      setSelected(3);
      setValue("DocPageAll", false);
      setValue("DocPageUnsorted", false);
      setValue("DocPagePrior", true);
      setValue("DocTabForPage", false);
    } else if (lastTabCurrent) {
      setSelected(4);
      setValue("DocPageAll", false);
      setValue("DocPageUnsorted", false);
      setValue("DocPagePrior", false);
      setValue("DocTabForPage", true);
    }
  }, [allTabCurrent, unsortedTabCurrent, associatedTabCurrent, lastTabCurrent, setValue]);

  const handleSelected = (selectedValue) => {
    // Update the selected state
    setSelected(selectedValue);

    // Set the corresponding DocPage value to true and others to false
    setValue("DocPageAll", selectedValue === 1);
    setValue("DocPageUnsorted", selectedValue === 2);
    setValue("DocPagePrior", selectedValue === 3);
    setValue("DocTabForPage", selectedValue === 4);
  };

  return (
    <div className="radio-buttons-container">
      <div className="d-flex radio-buttons">
        <div
          className={`radio-option ${selected === 1 ? "selected" : ""}`}
          onClick={() => handleSelected(1)} // Set selected to 1
        >
          <input
            type="radio"
            value="DocPageAll"
            {...register("DocPageAll")}
            className="radio-input"
            checked={selected === 1} // Reflect the selected state
            readOnly // Make the input read-only
          />
          <div className={`radio-circle ${selected === 1 ? "checked" : ""}`}></div>
          <span>All Tab</span>
        </div>

        <div
          className={`radio-option ${selected === 2 ? "selected" : ""}`}
          onClick={() => handleSelected(2)} // Set selected to 2
        >
          <input
            type="radio"
            value="DocPageUnsorted"
            {...register("DocPageUnsorted")}
            className="radio-input"
            checked={selected === 2}
            readOnly
          />
          <div className={`radio-circle ${selected === 2 ? "checked" : ""}`}></div>
          <span>Unsorted Tab</span>
        </div>
      </div>

      <div className="d-flex radio-buttons">
        <div
          className={`radio-option ${selected === 3 ? "selected" : ""}`}
          onClick={() => handleSelected(3)} // Set selected to 3
        >
          <input
            type="radio"
            value="DocPagePrior"
            {...register("DocPagePrior")}
            className="radio-input"
            checked={selected === 3}
            readOnly
          />
          <div className={`radio-circle ${selected === 3 ? "checked" : ""}`}></div>
          <span>Prior Page Associated Tab</span>
        </div>

        <div
          className={`radio-option ${selected === 4 ? "selected" : ""}`}
          onClick={() => handleSelected(4)} // Set selected to 4
        >
          <input
            type="radio"
            value="DocTabForPage"
            {...register("DocTabForPage")}
            className="radio-input"
            checked={selected === 4}
            readOnly
          />
          <div className={`radio-circle ${selected === 4 ? "checked" : ""}`}></div>
          <span>Last Tab Accessed</span>
        </div>
      </div>
    </div>
  );
}

export default DocPageTabModal;
