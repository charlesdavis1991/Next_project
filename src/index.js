// import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Main from "./Routes/main";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
// import "../../../public/BP_resources/css/home-original.css";
import "../public/BP_resources/css/home-original.css";
import "./main.css";
import store, { persistor } from "./Redux/store";
import { ClientDataProvider } from "./Components/ClientDashboard/shared/DataContext";
import { FooterProvider } from "./Components/common/shared/FooterContext";

import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "ORg4AjUWIQA/Gnt2VlhhQlJCfV5AQmBIYVp/TGpJfl96cVxMZVVBJAtUQF1hTX9SdkBiXn5bdHFVR2Zd"
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ClientDataProvider>
        <FooterProvider>
          <Main />
        </FooterProvider>
      </ClientDataProvider>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log());
