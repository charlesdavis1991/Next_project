import React from "react";
import UserTypeCheckbox from "./UserTypeCheckbox";
import { useWindowWidth } from "./provider/WindowWidthProvider";
import UserTypeCheckboxLessScreen from "./UserTypeCheckboxLessScreen";
const UserTypes = ({
  caseData,
  rowUserTypes,
  handleUserTypeChange,
  isStacked,
}) => {
  const window = useWindowWidth();
  const isStacked2 = window <= 1560;
  return (
    <div
      className="d-flex flex-column"
      style={{
        position: "relative",
        left: "20%",
      }}
    >
      {/* User types 1 and 4 */}
      <div
        className="d-flex"
        style={{
          flexDirection: isStacked ? "column" : "row",
        }}
      >
        {isStacked2 ? (
          <>
            <UserTypeCheckboxLessScreen
              label={caseData?.user_type1 || null}
              userId={caseData?.firm_user1?.id}
              checked={rowUserTypes?.user_type1}
              onChange={() => handleUserTypeChange("user_type1")}
              marginLeft="0"
              firm_user1={caseData.firm_user1}
            />
            <UserTypeCheckboxLessScreen
              label={caseData?.user_type2 || null}
              userId={caseData?.firm_user2?.id}
              checked={rowUserTypes?.user_type2}
              onChange={() => handleUserTypeChange("user_type2")}
              marginLeft={isStacked ? "0" : "5px"}
              firm_user1={caseData.firm_user2}
            />
          </>
        ) : (
          <>
            <UserTypeCheckbox
              label={caseData?.user_type1 || null}
              userId={caseData?.firm_user1?.id}
              checked={rowUserTypes?.user_type1}
              onChange={() => handleUserTypeChange("user_type1")}
              marginLeft="0"
              firm_user1={caseData.firm_user1}
            />
            <UserTypeCheckbox
              label={caseData?.user_type2 || null}
              userId={caseData?.firm_user2?.id}
              checked={rowUserTypes?.user_type2}
              onChange={() => handleUserTypeChange("user_type2")}
              marginLeft={isStacked ? "0" : "5px"}
              firm_user1={caseData.firm_user2}
            />
          </>
        )}
      </div>

      {/* User types 2 and 5 */}
      <div
        className="d-flex"
        style={{
          flexDirection: isStacked ? "column" : "row",
        }}
      >
        {isStacked2 ? (
          <>
            <UserTypeCheckboxLessScreen
              label={caseData?.user_type3 || null}
              userId={caseData?.firm_user3?.id}
              checked={rowUserTypes?.user_type3}
              onChange={() => handleUserTypeChange("user_type3")}
              marginLeft="0"
              firm_user1={caseData.firm_user3}
            />
            <UserTypeCheckboxLessScreen
              label={caseData?.user_type4 || null}
              userId={caseData?.firm_user4?.id}
              checked={rowUserTypes?.user_type4}
              onChange={() => handleUserTypeChange("user_type4")}
              marginLeft={isStacked ? "0" : "5px"}
              firm_user1={caseData.firm_user4}
            />
          </>
        ) : (
          <>
            <UserTypeCheckbox
              label={caseData?.user_type3 || null}
              userId={caseData?.firm_user3?.id}
              checked={rowUserTypes?.user_type3}
              onChange={() => handleUserTypeChange("user_type3")}
              marginLeft="0"
              firm_user1={caseData.firm_user3}
            />
            <UserTypeCheckbox
              label={caseData?.user_type4 || null}
              userId={caseData?.firm_user4?.id}
              checked={rowUserTypes?.user_type4}
              onChange={() => handleUserTypeChange("user_type4")}
              marginLeft={isStacked ? "0" : "5px"}
              firm_user1={caseData.firm_user4}
            />
          </>
        )}
      </div>

      {/* User types 3 and 6 */}
      <div
        className="d-flex"
        style={{
          flexDirection: isStacked ? "column" : "row",
        }}
      >
        {isStacked2 ? (
          <>
            {" "}
            <UserTypeCheckboxLessScreen
              label={caseData?.user_type5 || null}
              userId={caseData?.firm_user5?.id}
              checked={rowUserTypes?.user_type5}
              onChange={() => handleUserTypeChange("user_type5")}
              marginLeft="0"
              firm_user1={caseData.firm_user5}
            />
            <UserTypeCheckboxLessScreen
              label={caseData?.user_type6 || null}
              userId={caseData?.firm_user6?.id}
              checked={rowUserTypes?.user_type6}
              onChange={() => handleUserTypeChange("user_type6")}
              marginLeft={isStacked ? "0" : "5px"}
              firm_user1={caseData.firm_user6}
            />
          </>
        ) : (
          <>
            {" "}
            <UserTypeCheckbox
              label={caseData?.user_type5 || null}
              userId={caseData?.firm_user5?.id}
              checked={rowUserTypes?.user_type5}
              onChange={() => handleUserTypeChange("user_type5")}
              marginLeft="0"
              firm_user1={caseData.firm_user5}
            />
            <UserTypeCheckbox
              label={caseData?.user_type6 || null}
              userId={caseData?.firm_user6?.id}
              checked={rowUserTypes?.user_type6}
              onChange={() => handleUserTypeChange("user_type6")}
              marginLeft={isStacked ? "0" : "5px"}
              firm_user1={caseData.firm_user6}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default UserTypes;
