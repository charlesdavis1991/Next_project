import React from "react";

const ContactFax = ({ faxNumber }) => {
  const formatFax = (fax) => {
    if (!fax) return null;
    return (
      <>
        <span>({fax.slice(0, 3)}) </span>
        {fax.slice(3, 6)}-{fax.slice(6)}
      </>
    );
  };

  return (
    <p className="colFont info_fax">
      {faxNumber ? (
        formatFax(faxNumber)
      ) : (
        <span className="text-primary-20">(###) ###-####</span>
      )}
      <span className="ml-2 text-grey">fax</span>
    </p>
  );
};

export default ContactFax;
