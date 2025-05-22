import React, { useEffect, useState } from "react";
import Button from "../../common/button";
import AddEditModal from "../modals/add-edit-modal";
import useFirmAddress from "../hooks/useFirmAddress";
import TableFirmSettings from "../../common/table-firm-settings";
import api from "../../../../api/api";

const FirmAddressTabOne = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [firmAdds, setFirmAdds] = useState();

  const { firmAddress, refetch } = useFirmAddress();
  const [data, setData] = useState();

  useEffect(() => {
    if (firmAddress) {
      setFirmAdds(firmAddress.firm_addresses);
    }
  }, [firmAddress]);

  const handleAddShowAddressModal = () => {
    setShowAddModal(true);
  };

  const handleShowEditModal = async (add_id) => {
    try {
      const response = await api.get(
        `/api/firmsetting-page/edit-firm-address/`,
        {
          params: {
            contact_id: add_id,
          },
        }
      );
      console.log(response.data);
      setData(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckboxChange = (id, type) => async (event) => {
    const checked = event.target.checked;

    const fieldMap = {
      physical: "physical",
      main: "main",
      mail: "mail",
      administrative: "administrative",
      invoicing: "invoicing",
    };

    const updatedFirmAdds = firmAdds.map((firmAdd) => {
      if (firmAdd.id === id) {
        return { ...firmAdd, [fieldMap[type]]: checked };
      }
      return firmAdd;
    });

    const updatedAddress = updatedFirmAdds.find((firmAdd) => firmAdd.id === id);

    try {
      const response = await api.post(
        `/api/firmsetting-page/update-address-type/`,
        {
          contact_id: updatedAddress.id,
          address_type: fieldMap[type],
          check: checked,
        }
      );
      refetch();

      setFirmAdds(updatedFirmAdds);
    } catch (error) {
      console.error("API call failed, reverting changes", error);

      const revertedFirmAdds = firmAdds.map((firmAdd) => {
        if (firmAdd.id === id) {
          return { ...firmAdd, [fieldMap[type]]: !checked };
        }
        return firmAdd;
      });

      setFirmAdds(revertedFirmAdds);
    }
  };
  return (
    <div col-md-12>
      <div className="m-t-5 m-b-5">
        <Button
          text="Add Address"
          className="btn-success"
          onClick={handleAddShowAddressModal}
        />
      </div>
      <TableFirmSettings>
        <thead>
          <tr id="user_acc">
            <th></th>
            <th className="td-autosize">Address</th>
            <th>Physical</th>
            <th>Invoicing</th>
            <th>Main</th>
            <th>Mail</th>
            <th>Administrative</th>
          </tr>
        </thead>
        <tbody>
          {firmAdds &&
            firmAdds.map((firm_add, idx) => (
              <tr key={firm_add?.id} style={{ height: "35px" }}>
                <td onClick={() => handleShowEditModal(firm_add?.id)}>
                  {idx + 1}
                </td>
                <td
                  className="td-autosize"
                  onClick={() => handleShowEditModal(firm_add?.id)}
                >{`${firm_add?.address1}, ${firm_add?.address2}, ${firm_add?.city}, ${firm_add?.state}, ${firm_add?.zip}`}</td>
                {[
                  "physical",
                  "invoicing",
                  "main",
                  "mail",
                  "administrative",
                ].map((type) => (
                  <td key={type}>
                    <input
                      type="checkbox"
                      checked={firm_add?.[type]}
                      onChange={handleCheckboxChange(firm_add?.id, [type])}
                    />
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </TableFirmSettings>

      <AddEditModal
        showModal={showEditModal}
        handleClose={() => setShowEditModal(false)}
        refetch={refetch}
        data={firmAddress}
        filledData={data}
        isEdit={true}
      />

      <AddEditModal
        showModal={showAddModal}
        handleClose={() => setShowAddModal(false)}
        refetch={refetch}
        data={firmAddress}
      />
    </div>
  );
};

export default FirmAddressTabOne;
