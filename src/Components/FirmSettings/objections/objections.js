import React, { useMemo, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetObjections, {
  useGetCaseType,
  useObjectionsFilters,
} from "./hooks/useGetObjections";
import AddEditObjectionModal from "./modals/add-edit-objections";
import TableFirmSettings from "../common/table-firm-settings";
import api from "../../../api/api";

const ObjectionsTabs = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedCounties, setSelectedCounties] = useState("all");
  const [selectedVenues, setSelectedVenues] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [data, setData] = useState();

  const { data: ObjectionsFilters, refetch: filterObjections } =
    useObjectionsFilters();
  const { data: Objections, refetch: fetchObjections } = useGetObjections();
  const { data: case_types } = useGetCaseType();

  const filteredObjections = useMemo(() => {
    if (!Objections) return [];

    return Objections.filter((objection) => {
      if (
        selectedJurisdiction !== "all" &&
        objection.jurisdictiontype?.id !== Number(selectedJurisdiction)
      ) {
        return false;
      }

      // Check state filter
      if (
        selectedState !== "all" &&
        objection?.state?.StateAbr !== selectedState
      ) {
        return false;
      }

      // Check county filter
      if (
        selectedCounties !== "all" &&
        objection?.county?.id !== selectedCounties
      ) {
        return false;
      }

      // Check venue filter
      if (selectedVenues !== "all" && objection.venue !== selectedVenues) {
        return false;
      }

      // Check category filter
      if (
        selectedCategory !== "all" &&
        objection.category !== selectedCategory
      ) {
        return false;
      }

      return true;
    });
  }, [
    Objections,
    selectedJurisdiction,
    selectedState,
    selectedCounties,
    selectedVenues,
    selectedCategory,
  ]);

  const handleShowEditModal = async (objectionId) => {
    try {
      const response = await api.get(`/api/firmsetting-page/edit-objection/`, {
        params: { objection_id: objectionId },
      });
      console.log(response.data);
      setData(response.data);
      setShowEditModal(true);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div className="m-b-5">
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="btn-wrapper align-items-center m-b-5">
        <div className="d-flex align-items-center mr-2">
          <p className="m-r-5">Jurisdiction</p>
          <select
            className="form-control height-2"
            value={selectedJurisdiction}
            onChange={(e) => setSelectedJurisdiction(e.target.value)}
            id="jurisdiction-filter"
          >
            <option value="all">All</option>
            {ObjectionsFilters?.jurisdiction_types?.map((jurisdiction) => (
              <option key={jurisdiction.id} value={jurisdiction.id}>
                {jurisdiction.name}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex align-items-center mr-2">
          <p className="m-r-5">State</p>
          <select
            className="form-control height-2"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            id="state-filter"
          >
            <option value="all">All</option>
            {ObjectionsFilters?.states?.map((state) => (
              <option key={state.id} value={state.StateAbr}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="d-flex align-items-center mr-2">
          <p className="m-r-5">County</p>
          <select
            className="form-control height-2"
            value={selectedCounties}
            onChange={(e) => setSelectedCounties(e.target.value)}
            id="county-filter"
          >
            <option value="all">All</option>
            {ObjectionsFilters?.counties?.map((county) => (
              <option key={county.id} value={county.id}>
                {county.name}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex align-items-center mr-2">
          <p className="m-r-5">Venues</p>
          <select
            className="form-control height-2"
            value={selectedVenues}
            onChange={(e) => setSelectedVenues(e.target.value)}
            id="venue-filter"
          >
            <option value="all">All</option>
            {ObjectionsFilters?.objection_venues?.map((venue) => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </div>
        <div className="d-flex align-items-center mr-2">
          <p className="m-r-5">Category</p>
          <select
            className="form-control height-2"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            id="category-filter"
          >
            <option value="all">All</option>
            {ObjectionsFilters?.objection_categories?.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowModal(true)}
          type="button"
          className="btn btn-primary height-35"
        >
          <span className="font-weight-bold pr-2 text-gold">+</span>Objection
        </button>
      </div>

      <TableFirmSettings>
        <thead>
          <tr id="objection-class">
            <th className="td-autosize"></th>
            <th className="td-autosize">Jurisdiction</th>
            <th className="td-autosize">State</th>
            <th className="td-autosize">County</th>
            <th className="td-autosize">Case type</th>
            <th className="td-autosize">Venue</th>
            <th className="td-autosize">Category</th>
            <th className="td-autosize">Name</th>
            <th className="">Objection</th>
          </tr>
        </thead>
        <tbody className="objection_tbody">
          {filteredObjections?.map((item, idx) => (
            <tr
              onClick={() => handleShowEditModal(item.id)}
              id="objection-class"
              style={{ height: "35px" }}
              key={item.id}
            >
              <td className="color-grey td-autosize">{idx + 1}</td>
              <td className="td-autosize">{item?.jurisdictiontype?.name}</td>
              <td className="td-autosize">{item?.state?.name}</td>
              <td className="td-autosize">{item?.county?.name}</td>
              <td className="td-autosize">{item?.case_type?.name}</td>
              <td className="td-autosize">{item?.venue}</td>
              <td className="td-autosize">{item?.category}</td>
              <td className="td-autosize">{item?.name}</td>
              <td className="td-autosize">{item?.objection}</td>
            </tr>
          ))}
        </tbody>
      </TableFirmSettings>

      <AddEditObjectionModal
        showModal={showEditModal}
        handleClose={() => setShowEditModal(false)}
        refetch={fetchObjections}
        filtersRefetch={filterObjections}
        filters={ObjectionsFilters}
        case_types={case_types}
        filledData={data}
        isEdit={true}
      />

      <AddEditObjectionModal
        showModal={showModal}
        handleClose={() => setShowModal(false)}
        refetch={fetchObjections}
        filtersRefetch={filterObjections}
        filters={ObjectionsFilters}
        case_types={case_types}
      />
    </div>
  );
};

export default ObjectionsTabs;
