import React from "react";

const MedicalProviderPlaceholder = () => {
  const specialityData = [
    {
      id: 7,
      color: "#0000FF",
      name: "Emergency Room",
      secondaryColor: "#E6E6FF",
    },
    {
      id: 1,
      color: "#DB0600",
      name: "Chiropractor",
      secondaryColor: "#FBE6E6",
    },
    {
      id: 2,
      color: "#035805",
      name: "MRI Facility",
      secondaryColor: "#E6EEE6",
    },
  ];

  const fadeSecondaryColor = (baseColor, step, totalSteps) => {
    const mixRatio = (1 - step / totalSteps) * 0.95; // Gradually fade
    const baseRGB = baseColor
      .match(/\w\w/g)
      .map((hex) => parseInt(hex, 16) / 255);
    const whiteRGB = [1, 1, 1];
    const fadedRGB = baseRGB.map(
      (color, i) => mixRatio * color + (1 - mixRatio) * whiteRGB[i]
    );
    return `rgb(${fadedRGB.map((color) => Math.round(color * 255)).join(",")})`;
  };

  return (
    <>
      {specialityData.map((speciality) => (
        <tr className="height-25" key={speciality.id}>
          {Array.from({ length: 14 }).map((_, index) => {
            // Keep the color same for the last 9th index
            const effectiveIndex = index >= 9 ? 8 : index; // If index is 9 or more, use 8 for color
            const fadedColor = fadeSecondaryColor(
              speciality.secondaryColor,
              effectiveIndex,
              12 // Number of total steps
            );

            return (
              <td
                key={index}
                className={`height-25 ${
                  index === 0 ? " color-black" : "color-black"
                }`}
                style={{
                  background: fadedColor,
                }}
              >
                {index === 0 && (
                  <div
                    className="d-flex align-items-center"
                    style={{ width: "fit-content" }}
                  >
                    <span
                      className="d-flex align-items-center justify-content-center text-center text-white specialty-icon speciality-box"
                      style={{
                        backgroundColor: speciality.color,
                      }}
                    >
                      {speciality.name[0]}
                    </span>
                    <p className="p-l-5 p-r-5">
                      {speciality.name ? speciality.name : null}
                    </p>
                  </div>
                )}
              </td>
            );
          })}
        </tr>
      ))}

      <div
        colSpan={14}
        style={{
          textAlign: "center",
          fontWeight: "normal",
          position: "absolute",
          top: "50%",
          left: "50%",
        }}
      >
        Add Medical Providers
      </div>
    </>
  );
};

// <tr className="">
//   {specialityData.map((speciality) => (
// <td
//   className="td-autosize color-black"
//   style={{ background: speciality.secondaryColor }}
// >
//   <div
//     className="d-flex align-items-center"
//     style={{ width: "fit-content" }}
//   >
//     <span
//       className="d-flex align-items-center justify-content-center text-center text-white specialty-icon speciality-box"
//       style={{
//         backgroundColor: `${speciality?.color}`,
//       }}
//     >
//       {speciality?.name[0]}
//     </span>
//     <p className="p-l-5 p-r-5">
//       {speciality?.name ? speciality?.name : null}
//     </p>
//   </div>
// </td>
//   ))}
//   <td ref={tdRef} colSpan={12}>
//     <svg
//       className="w-full h-auto"
//       height="125"
//       preserveAspectRatio="none"
//       viewBox={`0 0 ${viewBoxWidth} 125`}
//     >
//       <defs>
//         {/* Emergency Room Gradient */}
//         <linearGradient
//           id="emergencyGradient"
//           x1="0%"
//           y1="0%"
//           x2="100%"
//           y2="0%"
//         >
//           <stop offset="20%" stopColor="#007AFF" stopOpacity="0.05" />
//           <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
//         </linearGradient>

//         {/* MRI Gradient */}
//         <linearGradient id="mriGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//           <stop offset="20%" stopColor="#EDFDFF" stopOpacity="0.3" />
//           <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
//         </linearGradient>

//         {/* Chiropractor Gradient */}
//         <linearGradient
//           id="chiroGradient"
//           x1="0%"
//           y1="0%"
//           x2="100%"
//           y2="0%"
//         >
//           <stop offset="20%" stopColor="#FFEEEE" stopOpacity="0.3" />
//           <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
//         </linearGradient>
//       </defs>

//       {/* Emergency Room Row */}
//       <rect
//         x="0"
//         y="0"
//         width="200"
//         height="40"
//         fill="#007AFF"
//         opacity="0.1"
//       />
//       <rect
//         x="200"
//         y="0"
//         width={viewBoxWidth - 400}
//         height="40"
//         fill="url(#emergencyGradient)"
//       />
//       <text x="10" y="25" fontFamily="Arial" fontSize="14" fill="#007AFF">
//         Emergency Room
//       </text>

//       {/* MRI Row */}
//       <rect
//         x="0"
//         y="40"
//         width="200"
//         height="40"
//         fill="#035805"
//         opacity="0.1"
//       />
//       <rect
//         x="200"
//         y="40"
//         width={viewBoxWidth - 400}
//         height="40"
//         fill="url(#mriGradient)"
//       />
//       <text x="10" y="65" fontFamily="Arial" fontSize="14" fill="#035805">
//         MRI
//       </text>

//       {/* Chiropractor Row */}
//       <rect
//         x="0"
//         y="80"
//         width="200"
//         height="40"
//         fill="#DB0600"
//         opacity="0.1"
//       />
//       <rect
//         x="200"
//         y="80"
//         width={viewBoxWidth - 400}
//         height="40"
//         fill="url(#chiroGradient)"
//       />
//       <text x="10" y="105" fontFamily="Arial" fontSize="14" fill="#DB0600">
//         Chiropractor
//       </text>

//       {/* Click to Add Text */}
//       <text
//         x={viewBoxWidth / 2}
//         y="62.5"
//         fontFamily="Arial"
//         fontSize="16"
//         fontWeight="bold"
//         fill="#6B7280"
//         textAnchor="middle"
//       >
//         CLICK TO ADD MEDICAL PROVIDER
//       </text>
//     </svg>
//   </td>
// </tr>

export default MedicalProviderPlaceholder;
