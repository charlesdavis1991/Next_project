import { combineReducers } from "redux";
import searchReducer from "./search/reducers";
import inboxReducer from "./inbox/reducers";
import caseReducer from "./case/reducers";
import todosReducer from "./todos/reducers";
import injuriesReducer from "./injuries/reducer";
import menuReducer from "./menu/reducers";
import modalReducer from "./modal/reducers";
import clientProviderReducer from "./client-providers/clientProviderSlice";
import clientReducer from "./client/clientSlice";
import caseDataReducer, { fetchAllPages } from "./caseData/caseDataSlice";
import chatReducer from "./chat/reducers";
import generalReducer from "./general/reducers";
import accidentReducer from "./accident/accidentSlice";
import settingsReducer from "./settings/settingsSlice";
import noteReducer from "./notes/reducers";
import notesReducer from "./notes/notesSlice";
import insuranceReducer from "./insurance/insuranceSlice";
import searchSliceReducer from "./search/searchSlice";
import directorySliceReducer from "./Directory/directorySlice";
import litigationSliceReducer from "./litigation-event/litigationEventSlice";
import dynamicWidthReducer from "./header_width/reducer";
import selectedStateReducer from "./selectedState/reducers.js";
import selectedSpecialityReducer from "./selectedSpeciality/reducers.js";

import checkListReducer from "./checklist/reducer";
import blurEffectReducer from "./header_blur/reducer";
import commonLoadingEffectReducer from "./common/Loader/reducer";
import setHeaderNamerReducer from "./header_name/reducer";
import headerChecklistOpen from "./header_checklist/reducer";
import timeCodeSlice from "./time-code/timeCodeSlice.js";
import statuteSlice from "./statue-data/statuteSlice.js";
import judgeSlice from "./judge-table/judgeSlice.js";
import processServerSlice from "./process-server/processServerSlice.js";
import courtsSlice from "./courts-table/courtsSlice.js";
import expertsSlice from "./experts-table/expertsSlice.js";
import insuranceAdjustersSlice from "./insuranceAdjuster/insuranceAdjusterSlice.js";
import insuranceCompanies from "./insuranceCompany/insuranceCompanySlice.js";
import attorneyDirectoriesSlice from "./attorny-table/attornySlice.js";
import departmentSlice from "./department-table/departmentSlice.js";
import caseLoan from "./case-loan/caseLoan.js";
import lawFirmSlice from "./law-firm/lawFirmSlice.js";
import reportingAgenciesSlice from "./reportingAgencies/reportingAgenciesAdjusterSlice.js";
import pagesSlice from "./pages/pagesSlice.js";
import jurisdictionSlice from "./jurisdiction-table/jurisdictionSlice.js";
import districtSlice from "./district-table/districtSlice.js";
import statesSlice from "./states/statesSlice.js";
import divisionSlice from "./divisions/divisonSlice.js";
import circuitSlice from "./circuits/circuitSlice.js";
import courtFormSlice from "./courtForms-table/courtFormsSlice.js";
import calculatedDateSlice from "./calculated-dates-table/calculatedDatesSlice.js";
import getPageIdReducer from "./getPageId/reducer.js";
import dependantDateTypeSlice from "./dependant-date-type-table/dependantDateTypeSlice.js"
import expertCategorySlice from "./expertCategories/expertCategoriesSlice.js";
import clickKeysSlice from "./clickKeys/clickKeysSlice.js";
import statusesSlice from "./status-table/statusesSlice.js";
import checklistsSlice from "./checklists-table/checklistsSlice.js";
import panelChecklistsSlice from  "./panelChecklists-table/panelChecklistsSlice.js";
import workunitsSlice from "./workunit-table/workunitSlice.js";
import actsSlice from "./act-table/actsSlice.js";

// Combining both reducers into a single root reducer
const rootReducer = combineReducers({
  search: searchReducer,
  inbox: inboxReducer,
  case: caseReducer,
  todos: todosReducer,
  injuries: injuriesReducer,
  menu: menuReducer,
  modal: modalReducer,
  clientProvider: clientProviderReducer,
  client: clientReducer,
  caseData: caseDataReducer,
  chat: chatReducer,
  general: generalReducer,
  accident: accidentReducer,
  settings: settingsReducer,
  note: noteReducer,
  notes: notesReducer,
  insurances: insuranceReducer,
  searchS: searchSliceReducer,
  dynamicWidth: dynamicWidthReducer,
  blurEffect: blurEffectReducer,
  loadEffect: commonLoadingEffectReducer,
  checkLists: checkListReducer,
  directory: directorySliceReducer,
  selectedState: selectedStateReducer,
  litigationEvent: litigationSliceReducer,
  selectedSpeciality: selectedSpecialityReducer,

  timeCodes: timeCodeSlice,

  statutes: statuteSlice,
  judges: judgeSlice,
  departments: departmentSlice,
  caseLoan: caseLoan,
  lawFirm: lawFirmSlice,
  processServers: processServerSlice,
  courts: courtsSlice,
  experts: expertsSlice,
  reportingAgencies: reportingAgenciesSlice,
  insuranceAdjusters: insuranceAdjustersSlice,
  insuranceCompanies: insuranceCompanies,
  attorneyDirectories: attorneyDirectoriesSlice,
  jurisdictions: jurisdictionSlice,
  districts: districtSlice,
  states: statesSlice,
  divisions: divisionSlice,
  circuits: circuitSlice,
  courtForms: courtFormSlice,
  calculatedDates: calculatedDateSlice,
  dependantDateTypes: dependantDateTypeSlice,
  expertCategories: expertCategorySlice,
  clickKeys: clickKeysSlice,
  statuses: statusesSlice,
  checklistsDirectory: checklistsSlice,
  panelChecklists: panelChecklistsSlice,
  workunits: workunitsSlice,
  acts: actsSlice,

  header_name: setHeaderNamerReducer,
  open: headerChecklistOpen,
  allPages: pagesSlice,
  page_id_click_record: getPageIdReducer,
});

export default rootReducer;
