import React, { useState, useEffect } from "react";
import CommonHeader from "../common/common-header";
import useGetClientPortalSettings from "./hooks/useEditClientPortal";
import api from "../../../api/api";

const ClientPortal = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const { data, refetch } = useGetClientPortalSettings();

  const [formState, setFormState] = useState({
    brandColor: "#0eddcf",
    headerFontStyle: "Arial",
    sidebarFontStyle: "Arial",
  });

  const FontSettings = [
    {
      id: 1,
      name: "Arial",
    },
    {
      id: 2,
      name: "Times New Roman",
    },
    {
      id: 3,
      name: "Courier New",
    },
    {
      id: 4,
      name: "Georgia",
    },
    {
      id: 5,
      name: "Helvetica",
    },
  ];

  useEffect(() => {
    if (data) {
      setFormState({
        brandColor: data.brand_color || "#0eddcf",
        headerFontStyle: data.header_font_style || "Arial",
        sidebarFontStyle: data.sidebar_font_style || "Arial",
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await api.post(
        "/api/firmsetting-page/edit-clientportal-settings/",
        {
          brandColor: formState.brandColor,
          headerFontSelect: formState.headerFontStyle,
          sidebarFontSelect: formState.sidebarFontStyle,
        }
      );

      if (response.status === 200) {
        refetch();
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <h2 className="font-weight-bold">Client Portal Font And Color</h2>
      <div className="mt-3 col-lg-6">
        <div className="row">
          <div className="col-sm-6">
            <label htmlFor="headerFontSelect">Select Header Font:</label>
            <select
              className="form-control"
              id="headerFontSelect"
              name="headerFontStyle"
              value={formState.headerFontStyle}
              onChange={handleInputChange}
            >
              {FontSettings.map((font) => (
                <option key={font.id} value={font.name}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-6">
            <label htmlFor="sidebarFontSelect">Select Sidebar Font:</label>
            <select
              className="form-control"
              id="sidebarFontSelect"
              name="sidebarFontStyle"
              value={formState.sidebarFontStyle}
              onChange={handleInputChange}
            >
              {FontSettings.map((font) => (
                <option key={font.id} value={font.name}>
                  {font.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-sm-6">
            <label htmlFor="colorPicker">Select Background Color:</label>
            <input
              type="color"
              id="colorPicker"
              className="form-control"
              name="brandColor"
              value={formState.brandColor}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-sm-6">
            <button onClick={handleSubmit} className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;
