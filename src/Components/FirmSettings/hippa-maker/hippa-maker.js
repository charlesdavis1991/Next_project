import React, { useEffect, useState } from "react";
import CommonHeader from "../common/common-header";
import useGetXYValues, {
  useDeleteHippaTemplate,
  useGenerateHippaTempalte,
  useSaveXYValues,
} from "./hooks/useGetHippaMakerApi";
import Input from "../common/Input";
import Button from "../common/button";

const HippaMaker = () => {
  const heading = "FIRM SETTINGS TITLE WITH CENTERED TEXT";
  const points = [
    "1. Firm settings panel instruction point one",
    "2. Firm settings panel instruction point two",
    "3. Firm settings panel instruction point three",
  ];

  const [XValue, setXValue] = useState("");
  const [YValue, setYValue] = useState("");
  const [file, setFile] = useState(null);

  const handleXValueChange = (e) => setXValue(e.target.value);
  const handleYValueChange = (e) => setYValue(e.target.value);

  const { data, refetch } = useGetXYValues();

  useEffect(() => {
    if (data) {
      setXValue(data.x_value);
      setYValue(data.y_value);
      if (data?.file_url.length > 0) {
        setFile(data?.file_url);
      }
    }
  }, [data]);

  const { saveXYValues } = useSaveXYValues();

  const handleSave = async () => {
    await saveXYValues({
      x_value: XValue,
      y_value: YValue,
    });

    refetch();
  };

  const { saveTemplate } = useGenerateHippaTempalte();
  const { deleteTemplate } = useDeleteHippaTemplate();
  const handleGenerateTemplate = async () => {
    console.log("Generating template", XValue, YValue, file);
    await saveTemplate({
      x_value: XValue,
      y_value: YValue,
      file: file,
    });
    refetch();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log("Selected file:", selectedFile);
    setFile(selectedFile);
  };

  return (
    <div className="tab-pane fade firm-settings-user-perms-fs active show">
      <div>
        <CommonHeader heading={heading} points={points} />
      </div>
      <div className="col-lg-12">
        <h3 className="mt-5 mb-3">Upload HIPAA Templates</h3>

        <div className="d-flex flex-row w-50 align-items-center ">
          <Input
            label="X Value"
            type="text"
            placeholder="Enter X Value"
            value={XValue}
            onChange={handleXValueChange}
            cn="d-flex align-items-center"
            labelCN=" m-b-0 text-nowrap m-r-5"
          />
          <Input
            label="Y Value"
            type="text"
            placeholder="Enter Y Value"
            value={YValue}
            onChange={handleYValueChange}
            cn="d-flex align-items-center"
            labelCN=" m-b-0 text-nowrap m-r-5"
          />
          <Button
            text="Save Address Value"
            onClick={handleSave}
            className="btn-primary"
          />
        </div>
        <div
          className="col-sm-6 m-t-5 m-b-5 d-flex flex-row align-items-center"
          style={{ gap: "10px" }}
        >
          {data?.file_name && (
            <div>
              {data?.file_name}
              <Button
                text="Delete"
                className="btn-danger m-l-5"
                onClick={async () => {
                  await deleteTemplate();
                  refetch();
                }}
              />
            </div>
          )}
        </div>
        <div className="col-sm-6">
          {!data?.file_name && (
            <Button
              text="Upload File"
              className="btn-primary m-r-5"
              isFileUpload={true}
              onFileChange={handleFileChange}
            />
          )}
          {file && <span className="m-r-5">{file?.name}</span>}
          <Button
            text="Generate Template"
            className="btn-success"
            onClick={handleGenerateTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export default HippaMaker;
