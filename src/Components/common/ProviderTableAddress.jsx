import React from "react";

const ProviderTableAddress = ({ fullAddress, website }) => {
  const { address, address2, city, state, zip } = fullAddress;
  return (
    <>
      {address || address2 ? (
        <span className="text-black p-0 m-0 is-search">
          {address && `${address}, `}
          {address2 && address2}
        </span>
      ) : (
        <span className="text-primary-50 p-0 m-0">Address</span>
      )}

      <br />
      {city ? (
        <span className="text-black p-0 m-0 is-search">{city},&nbsp;</span>
      ) : (
        <span className="text-primary-50 p-0 m-0">City,&nbsp;</span>
      )}
      {state ? (
        <span className="text-black p-0 m-0 is-search">{state && `${state},`}</span>
      ) : (
        <span className="text-primary-50 p-0 m-0">State,</span>
      )}
      {zip ? (
        <span className="text-black p-0 m-0 is-search">&nbsp;{zip}</span>
      ) : (
        <span className="text-primary-50 p-0 m-0">&nbsp;Zip</span>
      )}
      <br />
      {website ? (
        <span className="text-black p-0 m-0 is-search">{website}</span>
      ) : (
        <span className="text-primary-50 p-0 m-0">www.website.com</span>
      )}
    </>
  );
};

export default ProviderTableAddress;
