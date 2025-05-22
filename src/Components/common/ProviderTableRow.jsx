import React, { useState } from "react";
import AddProviderDirectoryModal from "../Modals/AddProviderDirectoryModalS";

const ProviderTableRow = ({ provider, index }) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = (provider) => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  return (
    <>
      <tr key={index} className="p-2" onClick={() => handleOpenPopup(provider)}>
        <td>{index + 1}</td>
        <td>{provider.search_name_provider}</td>
        <td
          style={{
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {provider.search_name_provider}
        </td>
        <td className="text-lowercase text-nowrap"
          style={{
            wordBreak: "break-word",
            whiteSpace: "normal",
          }}
        >
          {provider.website || ""}
        </td>
        <td
          style={{
            minWidth: "200px",
          }}
        >
          {provider.locations[0] ? (
            <span className="text-black p-0 m-0">
              {provider.locations[0].fullAddress.address}
              {provider.locations[0].fullAddress.address2
                ? `, ${provider.locations[0].fullAddress.address2}`
                : ""}
              <br />
              {provider.locations[0].fullAddress.city
                ? `${provider.locations[0].fullAddress.city}, `
                : "City, "}
              {provider.locations[0].fullAddress.state || "State"}
              {provider.locations[0].fullAddress.zip
                ? ` ${provider.locations[0].fullAddress.zip}`
                : " Zip"}
            </span>
          ) : (
            <span className="text-grey p-0 m-0">Address</span>
          )}
        </td>
        <td>{provider.locations?.length}</td>
        <td>{provider.BR}</td>
        <td>{provider.BP}</td>
        <td>{provider.PR}</td>
        <td>{provider.RP}</td>
        <td>{provider.L}</td>
        <td>{provider.searchable ? "Yes" : "No"}</td>
        <td>{provider.search_name_provider || ""}</td>
      </tr>

      {/* <AddProviderDirectoryModal
        handleClose={handleClosePopup}
        providerPopUp={showPopup}
        providerData={provider}
        isEdit={true}
      /> */}
    </>
  );
};

export default ProviderTableRow;
