import React, { useMemo } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const RenderProgress = React.memo(({ percentage }) => {
  const barStyle = buildStyles({
    pathColor: `#2897EC`,
    textColor: "black",
    trailColor: "#646464",
  });
  return (
    <div style={{ width: 50, height: 50 }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={barStyle}
      />
    </div>
  );
});

export default RenderProgress;
