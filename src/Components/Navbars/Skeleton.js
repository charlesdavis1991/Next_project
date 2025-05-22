import React from "react";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

const CustomSkeleton = () => {
  const dynamicWidth = useSelector((state) => state.dynamicWidth.dynamicWidth);
  return (
    <Box
      className="header-top-user-doi"
      sx={{
        width: `${dynamicWidth + 18 ?? 0}px`,
        height: "50px",
        backgroundColor: "rgb(255, 255, 255)",
        fontSize: "14px",
        marginTop: "-5px",
        flexWrap: "wrap",
        flex: "",
        clipPath: `polygon(9.2px 0, 97.9% 1px, ${dynamicWidth + 8.3}px 100%, 1px 100%)`,
      }}
    >
      <div className="d-flex justify-content-between">
        <p className="font-weight-semibold d-flex">
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={60} />
        </p>
        <div className="d-flex m-r-15">
          <p className="font-weight-semibold">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <p className="font-weight-semibold">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
          </p>
        </div>
        <div className="d-flex m-r-15">
          <p className="font-weight-semibold">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <p className="font-weight-semibold d-flex">
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={60} />
        </p>
        <div className="d-flex m-r-15">
          <p className="font-weight-semibold">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <p className="font-weight-semibold">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
          </p>
        </div>
        <div className="d-flex m-r-15">
          <p className="font-weight-semibold">
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={80} />
          </p>
        </div>
      </div>
    </Box>
  );
};

export default CustomSkeleton;
