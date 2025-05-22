import React from "react";
import { useSelector } from "react-redux";

export function VehicleNotesTableEdit() {
  const notes = useSelector((state) => state.accident?.notes);
  const accidentData = useSelector((state) => state.accident?.current);

  return (
    <table className="table table-borderless table-striped table-earning">
      <thead>
        <tr>
          <th scope="col" className="Exp-width-1p"></th>
          <th>Date</th>
          <th>Time</th>
          <th className="Exp-width-6p-padding-left-52px">User</th>
          <th>Note</th>
          <th>Category</th>
          <th></th>
        </tr>
      </thead>
      {/* <tbody id="table-body-cat-notes">
        {notes &&
          notes?.map((note) =>
            note.entity_type == "CarAccident" || note.entity_type == "Car" ? (
              note.category?.name == "Accident" ||
              note.category?.name == "Update Case Status" ||
              note.category?.name == "Critical" ? (
                <tr className={`${note?.entity_type}${note?.record_id}`}>
                  <td scope="row">1</td>
                  <td className="td-autosize">
                    {new Date(note.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="td-autosize">
                    {new Date(note.created_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </td>
                  <td className="td-autosize d-flex align-items-center mt-1">
                    {note.created_by?.profile_pic ? (
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                        <img
                          src={note.created_by.profile_pic}
                          alt="User Avatar"
                        />
                      </span>
                    ) : (
                      <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span>
                    )}
                    <span className="ml-2 text-black">
                      {note.created_by.first_name} {note.created_by.last_name}
                    </span>
                  </td>
                  <td className="client_page_note_row Exp-color-000">
                    {note.description}
                  </td>
                  <td className="td-autosize">{note.category?.name}</td>
                  <td className="td-autosize hover-button">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-toggle="modal"
                      data-target="#edit-note-modal"
                      data-dismiss="modal"
                      onclick="editNotes('{{note.description}}', '{{note.id}}')"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ) : null
            ) : null
          )}
      </tbody> */}
      <tbody id="table-body-cat-notes">
        {notes?.map((note, index) =>
          note.entity_type === "CarAccident" || note.entity_type === "Car" ? (
            note.category?.name === "Accident" ||
            note.category?.name === "Update Case Status" ||
            (note.category?.name === "Critical" &&
              note.record_id === accidentData?.id) ? (
              <tr
                className={`${note.entity_type}${note.record_id}`}
                key={note.record_id}
              >
                <td scope="row">{index + 1}</td>
                <td className="td-autosize">
                  {new Date(note.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="td-autosize">
                  {new Date(note.created_at).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </td>
                <td className="td-autosize d-flex align-items-center mt-1">
                  <span className="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                    {note.created_by.profile_pic ? (
                      <img
                        src={note.created_by.profile_pic}
                        alt=""
                        className=""
                      />
                    ) : null}
                  </span>
                  <span className="ml-2 text-black">
                    {note.created_by.first_name} {note.created_by.last_name}
                  </span>
                </td>
                <td className="client_page_note_row Exp-color-000">
                  {note.description}
                </td>
                <td className="td-autosize">{note.category.name}</td>
                <td className="td-autosize hover-button">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-toggle="modal"
                    data-target="#exampleModalCenter"
                    data-dismiss="modal"
                    onClick={() => editNotes(note.description, note.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ) : null
          ) : null
        )}
      </tbody>
    </table>
  );
}

export function VehicleNotesTable() {
  const notes = useSelector((state) => state.accident?.notes);
  const accidentData = useSelector((state) => state.accident.current);

  return (
    <table className="table table-borderless table-striped table-earning mt-4">
      <tbody className="tbody-panels">
        {notes?.map((note, index) =>
          note.category?.name === "Accident" ||
          note.category?.name === "Update Case Status" ||
          (note.category?.name === "Critical" &&
            note.record_id === accidentData?.id) ? (
            <tr key={note.id}>
              <td className="td-autosize serial-number"></td>
              <td className="td-autosize">
                {new Date(note.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </td>
              <td className="td-autosize">
                {new Date(note.created_at).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
              </td>
              <td className="td-autosize">
                <div className=" d-flex align-items-center">
                  {note?.created_by?.bp_userprofile?.bp_attorney_userprofile
                    ?.profile_pic ? (
                    <img
                      src={
                        note?.created_by?.bp_userprofile
                          ?.bp_attorney_userprofile?.profile_pic
                      }
                      alt="avatar"
                      className="avatar-img"
                    />
                  ) : (
                    <span className="ic ic-avatar ic-19 has-avatar-icon has-cover-img"></span>
                  )}
                  <span className="ml-2 text-black">
                    {note?.created_by?.first_name} {note?.created_by?.last_name}
                  </span>
                </div>
              </td>
              <td className="td-autosize">
                Accident Information Note: {note?.description}
              </td>
            </tr>
          ) : null
        )}
      </tbody>
    </table>
  );
}
