import React,{useState} from "react";
import ReportAgency from "./ReportAgency";
import ReportInfo from "./ReportInfo";
import ReportTakenBy from "./ReportTakenBy";
import TitleBar from "./TitleBar";
import DocumentRow from "../DocumentRow/DocumentRow";
import "../../../public/BP_resources/css/reports-page-15.css";
import NotesPanel from "../NotesPanelSection/NotesPanel";
import EditReportModal from "./ReportModals/EditReportModal";
const DummyReportPanel = ({handleClose,selectedReport,setSelectedReport,onFetchReports,onShowDeleteConfirmPopup,activeTab}) => {
    // const [selectedReport, setSelectedReport] = useState(null);
    
    const report = {
                "id": 0,
                "report_type_name": null,
                "reporting_agency_name": "",
                "contact_first_name": "",
                "contact_last_name": "",
                "contact_title": "",
                "name": "",
                "payee": "",
                "address": "",
                "address1": "",
                "city": "",
                "state": "",
                "zip_code": "",
                "phone": "",
                "extension": "",
                "fax": "",
                "email": "",
                "website": "",
                "reporter_firstname": "",
                "reporter_lastname": "",
                "title": "",
                "cost": "0.69",
                "report_taken": false,
                "completed": null,
                "date_taken": null,
                "Enabled": false,
                "report_number": "",
                "date_ordered": null,
                "date_recieved": null,
                "is_blocked": false,
                "for_client": 3,
                "for_case": 46,
                "report_typeID": null,
                "for_reporting_agency": 33,
                "documents": []
            }
    return (
    <>
        <div className="report" key={report.id}>
            <TitleBar {...report} />
                <div className="flex-row d-flex">
                    <div className="reports-data row no-gutters equal-column-wrapper position-relative panels-direction-column insurance-col-panels padding-t-5" >
                        <div className="d-flex">
                            <ReportInfo
                            id={report.id}
                            report_taken={false}
                            date_taken={null}
                            report_number={""} //new
                            complete={null}
                            cost={"0.00"}
                            date_ordered={null}
                            onSelectReport={() => (
                                setSelectedReport(report),
                                (selectedEditableTabPanel.current =
                                "report-information"),
                                setForDeleteReportId(report.id)
                            )}
                            />

                            <ReportAgency
                                id={0}
                                title={report.name}
                                reporting_agency_name={report.reporting_agency_name}
                                address1={report.address}
                                address2={report.address1}
                                city={report.city}
                                state={report.state}
                                zip_code={report.zip_code}
                                phone_number={report.phone}
                                fax_number={report.fax}
                                email={report.email}
                                onSelectReport={() => (
                                    setSelectedReport(report),
                                    (selectedEditableTabPanel.current =
                                    "reporting-agency"),
                                    setForDeleteReportId(report.id)
                                )}
                            />
                        </div>
                        <div className="d-flex">
                            <ReportTakenBy
                            title={report.contact_title}
                            first_name={report.contact_first_name}
                            last_name={report.contact_last_name}
                            onSelectReport={() => (
                                setSelectedReport(report),
                                (selectedEditableTabPanel.current =
                                "report-taken-by"),
                                setForDeleteReportId(report.id)
                            )}
                            />
                        </div>
                    </div>

                    <NotesPanel
                    entity_type={"ReportingAgency"}
                    record_id={report.id}
                    module={"Reports"}
                    />
                </div>
                <div className="row documents-wrapper m-t-5">
                    <div className="col-12">
                    <div className="height-25">
                        <h4 className="text-capitalize d-flex align-items-center justify-content-center h-100 text-lg text-upper-case background-main-10 font-weight-semibold text-center client-contact-title">
                        {report.report_type_name}
                        &nbsp;Document Row
                        </h4>
                    </div>
                    <DocumentRow clientProvider={report} page="Reports" />
                    </div>
                </div>
                
            </div>
            {selectedReport && (
            <EditReportModal
                show={true}
                handleClose={handleClose}
                report={selectedReport}
                onFetchReports={onFetchReports}
                onShowDeleteConfirmPopup={onShowDeleteConfirmPopup}
                activeTab={activeTab}
            />
        )}

    </>);
}

export default DummyReportPanel;