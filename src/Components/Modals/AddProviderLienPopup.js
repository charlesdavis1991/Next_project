import React, { useEffect, useState, useRef } from "react";
import { Col, Modal, Nav, Row, Tab, Button } from "react-bootstrap";
import { Box } from "@mui/material";
import {   
    formatPhoneNumber,
    getCaseId,
    getClientId, 
} from "../../Utils/helper";
import api,{api_without_cancellation} from "../../api/api";
import useGetProviderLocations from "../TreatmentPage/modals/hooks/useGetProviderLocations";
import useGetProviderBySearchTerms from "../TreatmentPage/modals/hooks/useGetProviderBySearchTerm";
import AddressRow from "../TreatmentPage/modals/AddressRow";
import mixColorWithWhite from "../TreatmentPage/utils/helperFn";
import AddRedirectBackPopUp from "../TreatmentPage/modals/AddRedirectBackPopUp";
import SelectStateModal from "../TreatmentPage/modals/state-modal/SelectStateModal";
import { LinearProgress } from "@mui/material";
import ClientProvidersStyles from "../CaseDashboard/ClientProvidersStyles";
import PR from '../../assets/state-svg/puerto-rico';
import GU from "../../assets/state-svg/guam";
import MP from "../../assets/state-svg/marian";
import VI from "../../assets/state-svg/us-virigin-island";

function AddProviderLienPopup({  handleClose, addMedicalProviderObj, firmName, handleDisableSaveBtn }) {
    const { show,updateMedicalBillsState } = addMedicalProviderObj;
    const origin =
        process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const [providerType, setProviderType] = useState("addByDistance");
    const modalBodyRef = useRef(null);
    const handleModalClose = () => {
        handleClose();
    };
    const [statesAbrs, setStatesAbrs] = useState([]);
    const [speciality, setSpeciality] = useState([]);
    const [addRedirectedBackPopup, setAddRedirectedBackPopup] = useState({
        show: false,
    });
    const stateMap = {
        PR: PR,
        GU: GU,
        VI: VI,
        MP: MP,
    };
    const specialStates = Object.keys(stateMap);
    const [stateShow, setStateShow] = React.useState(false);
    const handleStateShow = () => setStateShow(!stateShow);

    const fetchSpecialityData = async () => {
        try {
        const response = await api.get(
            `${origin}/api/case-provider-specialties/`
        );
        if (response.status === 200) {
            setSpeciality(response.data);
        }
        } catch (error) {
        console.error(error);
        }
    };

    const fetchSatesData = async () => {
        try {
        const response = await api.get(`${origin}/api/states/`);
        if (response.status === 200) {
            setStatesAbrs(response.data);
        }
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        fetchSatesData();
        fetchSpecialityData();
    }, []);

    // Tab 3 All States Ref Effects
    const specialProviderRef = useRef(null);
    const [addProviderByManual, setAddProviderByManual] = useState({
        providerName: "",
        providerAddress1: "",
        providerAddress2: "",
        providerCity: "",
        providerState: "",
        providerZip: "",
        providerSpeciality: "",
        providerPhone: "",
        providerEmail: "",
        providerFax: "",
        providerWebsite: "",
    });
    const [dropdownOpenManual, setDropdownOpenManual] = useState(false);
    const [selectedSpecialityManual, setSelectedSpecialityManual] =
        useState(null);
    const handleSelectManual = (special) => {
        setSelectedSpecialityManual(special);
        setAddProviderByManual({
        ...addProviderByManual,
        providerSpeciality: special?.id,
        });
        setDropdownOpenManual(false);
    };
    const handlePhoneInput = (e) => {
        let numericValue = e.target.value.replace(/\D/g, "");
        let formattedValue = "";
        if (numericValue.length > 0) {
        formattedValue += `(${numericValue.slice(0, 3)}`;
        }
        if (numericValue.length > 3) {
        formattedValue += `) ${numericValue.slice(3, 6)}`;
        }
        if (numericValue.length > 6) {
        formattedValue += `-${numericValue.slice(6, 10)}`;
        }

        e.target.value = formattedValue;

        setAddProviderByManual({
        ...addProviderByManual,
        providerPhone: formattedValue,
        });
    };

    const handleFaxInput = (e) => {
        let numericValue = e.target.value.replace(/\D/g, "");
        let formattedValue = "";

        if (numericValue.length > 0) {
        formattedValue += `(${numericValue.slice(0, 3)}`;
        }
        if (numericValue.length > 3) {
        formattedValue += `) ${numericValue.slice(3, 6)}`;
        }
        if (numericValue.length > 6) {
        formattedValue += `-${numericValue.slice(6, 10)}`;
        }

        e.target.value = formattedValue;

        setAddProviderByManual({
        ...addProviderByManual,
        providerFax: formattedValue,
        });
    };
    // Tab 3 Api call
    const [searchTermFor3, setSearchTermFor3] = useState("");
    const [selectedProviderDirectory, setSelectedProviderDirectory] = useState(
        {}
    );
    const [providerByDirectoryData, setProviderByDirectoryData] = useState([]);
    const {
        data: getProvidersDirectory,
        fetchProviderBySearchTerm: fetchDirectory,
    } = useGetProviderBySearchTerms();
    const buildSearchTerm = (providerData) => {
        console.log(providerData);
        const fields = [
        // providerData?.providerSpeciality,
        selectedSpecialityManual?.name,
        providerData.providerName,
        providerData.providerAddress1,
        providerData.providerAddress2,
        providerData.providerCity,
        providerData.providerState,
        providerData.providerZip,
        providerData.providerPhone,
        ];

        const nonEmptyFields = fields.filter(
        (field) => field && field.trim() !== ""
        );

        return nonEmptyFields.join(" ");
    };
    const [isFavDirectoryLoading, setIsFavDirectoryLoading] = useState(false);

    useEffect(() => {
        if (getProvidersDirectory) {
        setProviderByDirectoryData(getProvidersDirectory);
        setIsFavDirectoryLoading(false);
        }
    }, [getProvidersDirectory]);

    useEffect(() => {
        const timer = setTimeout(() => {
        const searchTerm = buildSearchTerm(addProviderByManual);

        if (searchTerm.length >= 1) {
            setSearchTermFor3(searchTerm);
        }
        }, 500);

        return () => clearTimeout(timer);
    }, [
        addProviderByManual.providerName,
        addProviderByManual.providerAddress1,
        addProviderByManual.providerAddress2,
        addProviderByManual.providerCity,
        addProviderByManual.providerState,
        addProviderByManual.providerZip,
        addProviderByManual.providerPhone,
        selectedSpecialityManual?.name,
    ]);

    useEffect(() => {
        if (searchTermFor3) {
        fetchDirectory({ search_term: searchTermFor3 });
        }
    }, [searchTermFor3]);
    const handleAdditionByManual = async () => {
        try {
        if (Object.keys(selectedProviderDirectory)?.length > 0) {
            const response = await api_without_cancellation.post(
            "/api/providers/attach-provider-to-case/",
            {
                provider_id: selectedProviderDirectory?.location?.added_by,
                location_id: selectedProviderDirectory?.location?.id,
                case_id: getCaseId(),
                specialty_id: selectedProviderDirectory?.specialty?.id,
            }
            );
            if (response.status === 201 || response.status === 200) {
            // setAddRedirectedBackPopup({
            //     show: true,
            //     ...selectedProviderDirectory,
            // });
            setSelectedProviderDirectory({});
            handleDisableSaveBtn(false);
            updateMedicalBillsState();
            }
        } else {
            const response = await api_without_cancellation.post(
            "/api/providers/create-provider-location-attach/",
            {
                specialty_id: selectedSpecialityManual?.id,
                provider_name: addProviderByManual?.providerName,
                address1: addProviderByManual?.providerAddress1,
                address2: addProviderByManual?.providerAddress2,
                city: addProviderByManual?.providerCity,
                state: addProviderByManual?.providerState,
                zip: addProviderByManual?.providerZip,
                phone: addProviderByManual?.providerPhone,
                fax: addProviderByManual?.providerFax,
                email: addProviderByManual?.providerEmail,
                website: addProviderByManual?.providerWebsite,
                case_id: getCaseId(),
            }
            );
            if (response.status === 201 || response.status === 200) {
            // setAddRedirectedBackPopup({
            //     show: true,
            //     provider: addProviderByManual?.providerName,
            //     specialty: selectedSpecialityManual,
            //     location: {
            //     website: addProviderByManual?.providerWebsite,
            //     address: addProviderByManual?.providerAddress1,
            //     address2: addProviderByManual?.providerAddress2,
            //     city: addProviderByManual?.providerCity,
            //     state: addProviderByManual?.providerState,
            //     post_code: addProviderByManual?.providerZip,
            //     phone: addProviderByManual?.providerPhone,
            //     fax: addProviderByManual?.providerFax,
            //     email: addProviderByManual?.providerEmail,
            //     },
            // });
            setAddProviderByManual({
                providerName: "",
                providerAddress1: "",
                providerAddress2: "",
                providerCity: "",
                providerState: "",
                providerZip: "",
                providerPhone: "",
                providerFax: "",
                providerEmail: "",
                providerWebsite: "",
            });
            }
            handleDisableSaveBtn(false);
            updateMedicalBillsState();
        }
        } catch (error) {
        console.error(error);
        }
    };
    const handleAdditionByManualByNameSpeciality = async () => {
        try {
        const response = await api_without_cancellation.post(
            "/api/providers/create-provider-location-attach/",
            {
            specialty_id: selectedSpecialityManual?.id,
            provider_name: addProviderByManual?.providerName,
            address1: addProviderByManual?.providerAddress1,
            address2: addProviderByManual?.providerAddress2,
            city: addProviderByManual?.providerCity,
            state: addProviderByManual?.providerState,
            zip: addProviderByManual?.providerZip,
            phone: addProviderByManual?.providerPhone,
            fax: addProviderByManual?.providerFax,
            email: addProviderByManual?.providerEmail,
            website: addProviderByManual?.providerWebsite,
            case_id: getCaseId(),
            }
        );
        if (response.status === 201 || response.status === 200) {
            // setAddRedirectedBackPopup({
            // show: true,
            // provider: addProviderByManual?.providerName,
            // specialty: selectedSpecialityManual,
            // location: {
            //     website: addProviderByManual?.providerWebsite,
            //     address: addProviderByManual?.providerAddress1,
            //     address2: addProviderByManual?.providerAddress2,
            //     city: addProviderByManual?.providerCity,
            //     state: addProviderByManual?.providerState,
            //     post_code: addProviderByManual?.providerZip,
            //     phone: addProviderByManual?.providerPhone,
            //     fax: addProviderByManual?.providerFax,
            //     email: addProviderByManual?.providerEmail,
            // },
            // });
            setAddProviderByManual({
            providerName: "",
            providerAddress1: "",
            providerAddress2: "",
            providerCity: "",
            providerState: "",
            providerZip: "",
            providerPhone: "",
            providerFax: "",
            providerEmail: "",
            providerWebsite: "",
            });
        }
        handleDisableSaveBtn(false);
        updateMedicalBillsState();
        } catch (error) {}
    };
    useEffect(() => {
        function handleClickOutside(event) {
        if (
            specialProviderRef.current &&
            !specialProviderRef.current.contains(event.target)
        ) {
            setDropdownOpenManual(false);
        }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [specialProviderRef]);
    const handleFavDirectory = async (isFav, loc) => {
        console.log(isFav, loc);
        try {
        if (!isFav) {
            setProviderByDirectoryData((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
                locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: !isFav }
                : locItem
            ),
            }));
            setIsFavDirectoryLoading(true);

            const id = loc?.specialty?.id;
            const response = await api_without_cancellation.post(
            "/api/providers/mark-favorite/",
            {
                provider_id: loc?.location?.added_by,
                location_id: loc?.location?.id,
                specialty_id: id,
            }
            );
            if (response.status === 201) {
            fetchDirectory({ search_term: searchTermFor3 });
            }
        } else {
            setProviderByDirectoryData((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
                locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: !isFav }
                : locItem
            ),
            }));
            setIsFavDirectoryLoading(true);

            const response = await api_without_cancellation.post(
            "/api/providers/unfavorite/",
            {
                provider_id: loc?.location?.added_by,
                location_id: loc?.location?.id,
                specialty_id: loc?.specialty?.id,
            }
            );

            if (response.status === 200) {
            fetchDirectory({ search_term: searchTermFor3 });
            }
        }
        } catch (error) {
        console.error("Failed to update favorite:", error);

        setProviderByDirectoryData((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
            locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: isFav }
                : locItem
            ),
        }));
        fetchDirectory({ search_term: searchTermFor3 });
        }
    };

    // taab 2
    const [searchProviderByName, setSearchProviderByName] = useState({
        speciality: "",
        providerName: "",
    });
    const [providrerByNameData, setProviderByNameData] = useState([]);
    const [selectedProviderByName, setSelectedProviderByName] = useState({});
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const [additionalRows, setAdditionalRows] = useState(0);

    const { data: getProviders, fetchProviderBySearchTerm } =
        useGetProviderBySearchTerms();

    useEffect(() => {
        const handler = setTimeout(() => {
        if (searchProviderByName.providerName.length >= 3) {
            setDebouncedSearchTerm(searchProviderByName.providerName);
        } else if (searchProviderByName.providerName.length <= 2) {
            setDebouncedSearchTerm("");
            setProviderByNameData({});
        }
        }, 500);

        return () => clearTimeout(handler);
    }, [searchProviderByName.providerName]);

    useEffect(() => {
        if (debouncedSearchTerm) {
        fetchProviderBySearchTerm({ search_term: debouncedSearchTerm });
        }
    }, [debouncedSearchTerm]);

    const handleProviderAdditionByName = async () => {
        try {
        const response = await api_without_cancellation.post(
            "/api/providers/attach-provider-to-case/",
            {
            provider_id: selectedProviderByName?.location?.added_by,
            location_id: selectedProviderByName?.location?.id,
            case_id: getCaseId(),
            specialty_id: selectedProviderByName?.specialty?.id,
            }
        );
        if (response.status === 201 || response.status === 200) {
            // setAddRedirectedBackPopup({
            // show: true,
            // ...selectedProviderByName,
            // });
            setSelectedProviderByName({});
            // handleClose("true");
            setDebouncedSearchTerm("");
            handleDisableSaveBtn(false);
            updateMedicalBillsState();
            
        }
        } catch (error) {
        console.error(error);
        }
    };
    const [selectedProviderHover, setSelectedProviderByHover] = useState({});
    const [isFavNameLoading, setIsFavNameLoading] = useState(false);
    useEffect(() => {
        if (getProviders) {
        setProviderByNameData(getProviders);
        setIsFavNameLoading(false);
        }
    }, [getProviders]);
    const handleFavName = async (isFav, loc) => {
        try {
        if (!isFav) {
            setProviderByNameData((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
                locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: !isFav }
                : locItem
            ),
            }));
            setIsFavNameLoading(true);

            const id = loc?.specialty?.id;
            const response = await api_without_cancellation.post(
            "/api/providers/mark-favorite/",
            {
                provider_id: loc?.location?.added_by,
                location_id: loc?.location?.id,
                specialty_id: id,
            }
            );
            if (response.status === 201) {
            fetchProviderBySearchTerm({ search_term: debouncedSearchTerm });
            }
        } else {
            setProviderByNameData((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
                locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: !isFav }
                : locItem
            ),
            }));
            setIsFavNameLoading(true);
            const response = await api_without_cancellation.post(
            "/api/providers/unfavorite/",
            {
                provider_id: loc?.location?.added_by,
                location_id: loc?.location?.id,
                specialty_id: loc?.specialty?.id,
            }
            );

            if (response.status === 200) {
            fetchProviderBySearchTerm({ search_term: debouncedSearchTerm });
            }
        }
        } catch (error) {
        console.error("Failed to update favorite:", error);

        setProviderByNameData((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
            locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: isFav }
                : locItem
            ),
        }));
        fetchProviderBySearchTerm({ search_term: debouncedSearchTerm });
        }
    };

    // Tab 1
    const [searchQueries, setSearchQueries] = useState({
        address1: { address: "", city: "", state: "", zip: "", speciality: "" },
        address2: { address: "", city: "", state: "", zip: "", speciality: "" },
        employment: { address: "", city: "", state: "", zip: "", speciality: "" },
        input: { address: "", city: "", state: "", zip: "", speciality: "" },
    });
    const [providerByDistanceData, setProviderByDistance] = useState([]);

    const [dropdownState, setDropdownState] = useState({
        address1: false,
        address2: false,
        employment: false,
        input: false,
    });

    const [selectedSpecialities, setSelectedSpecialities] = useState({
        address1: null,
        address2: null,
        employment: null,
        input: null,
    });
    const { data, fetchProviderLocations } = useGetProviderLocations();

    const [selectedProviderByDistance, setSelectedProviderByDistance] = useState(
        {}
    );
    const [searchHistory, setSearchHistory] = useState({});
    const handleAdditionByDistance = async () => {
        try {
        const response = await api_without_cancellation.post(
            "/api/providers/attach-provider-to-case/",
            {
            provider_id: selectedProviderByDistance?.location?.added_by,
            location_id: selectedProviderByDistance?.location?.id,
            case_id: getCaseId(),
            specialty_id: providerByDistanceData?.specialty?.id,
            }
        );
        if (response.status === 201 || response.status === 200) {
            // setAddRedirectedBackPopup({
            // show: true,
            // specialty: providerByDistanceData?.specialty,
            // ...selectedProviderByDistance,
            // });
            setSelectedProviderByDistance({});
            handleDisableSaveBtn(false);
            updateMedicalBillsState();
            
            
        }
        } catch (error) {
        console.error(error);
        }
    };
    const [isFavLoading, setIsFavLoading] = useState(false);
    const handleFav = async (isFav, loc) => {
        console.log(isFav, loc);
        try {
        if (!isFav) {
            setProviderByDistance((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
                locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: !isFav }
                : locItem
            ),
            }));
            setIsFavLoading(true);

            const id = providerByDistanceData?.specialty?.id;
            const response = await api_without_cancellation.post(
            "/api/providers/mark-favorite/",
            {
                provider_id: loc?.location?.added_by,
                location_id: loc?.location?.id,
                specialty_id: id,
            }
            );
            if (response.status === 201) {
            fetchProviderLocations({ ...searchHistory });
            }
        } else {
            setProviderByDistance((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
                locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: !isFav }
                : locItem
            ),
            }));
            setIsFavLoading(true);

            const response = await api_without_cancellation.post(
            "/api/providers/unfavorite/",
            {
                provider_id: loc?.location?.added_by,
                location_id: loc?.location?.id,
                specialty_id: providerByDistanceData?.specialty?.id,
            }
            );

            if (response.status === 200) {
            fetchProviderLocations({ ...searchHistory });
            }
        }
        } catch (error) {
        console.error("Failed to update favorite:", error);

        setProviderByDistance((prevProviders) => ({
            ...prevProviders,
            locations: prevProviders?.locations?.map((locItem) =>
            locItem?.location?.id === loc?.location?.id
                ? { ...locItem, favorite: isFav }
                : locItem
            ),
        }));
        fetchProviderLocations({ ...searchHistory });
        }
    };
    const handleSearch = (type) => {
        const query = searchQueries[type];

        fetchProviderLocations({
        address1: query.address,
        address2: "",
        city: query.city,
        state: query.state,
        zip: query.zip,
        specialty_id: selectedSpecialities[type]?.id,
        });

        setSearchHistory({
        ...query,
        address1: query?.address,
        address2: "",
        specialty_id: query?.speciality,
        });
    };

    const handleSelectSpeciality = (type, special) => {
        setSelectedSpecialities((prev) => ({ ...prev, [type]: special }));
        setSearchQueries((prev) => ({
        ...prev,
        [type]: { ...prev[type], speciality: special?.id },
        }));
        setDropdownState((prev) => ({ ...prev, [type]: false }));
    };

    const fetchClientAddress = async () => {
        try {
        const response = await api.get(`/api/client/${getClientId()}/contacts/`);
        if (response.status === 200) {
            const { contact_1, contact_2, employment_contact } = response.data;

            setSearchQueries({
            address1: formatAddress(contact_1),
            address2: formatAddress(contact_2),
            employment: formatAddress(employment_contact),
            });
        }
        } catch (error) {
        console.error(error);
        }
    };

    const formatAddress = (contact) => ({
        address: `${contact?.address1 ?? ""} ${contact?.address2 ?? ""}`.trim(),
        city: contact?.city ?? "",
        state: contact?.state ?? "",
        zip: contact?.zip ?? "",
    });

    useEffect(() => {
        fetchClientAddress();
    }, []);

    useEffect(() => {
        if (!modalBodyRef.current) return;

        const updateAdditionalRows = () => {
        const availableSpace =
            modalBodyRef.current.getBoundingClientRect().height -
            (providerType === "addByName" ? 111 : 175) -
            ((providerType === "addByName"
            ? providrerByNameData?.locations?.length
            : providerByDistanceData?.locations?.length) ?? 0);

        const additionalRows = Math.floor(availableSpace / 25);

        if (providerType === "addByName") {
            setAdditionalRows(additionalRows);
        } else {
            setAdditionalRows(additionalRows);
        }
        };

        updateAdditionalRows(); // Run once on mount

        return () => {
        setAdditionalRows(0);
        // setAdditionalRowsByDistance(0);
        };
    }, [modalBodyRef, providerType]);
    useEffect(() => {
        if (data) {
        setProviderByDistance(data);
        setIsFavLoading(false);
        }
    }, [data]);

    const [stateNewShow, setStateNewShow] = useState(false);
    console.log(speciality);
    return (
        <>
        {!addRedirectedBackPopup.show && (
            // <Modal
            // show={show}
            // onHide={handleModalClose}
            // dialogClassName="max-1050 modal-dialog-centered "
            // contentClassName="custom-modal-new-provider"
            // size="lg"
            // style={{
            //     opacity: stateShow ? "0.5" : stateNewShow ? "0.5" : "1",
            // }}
            // >
            <div>
                <ClientProvidersStyles
                clientProviders={Object.values(speciality).map((s) => ({
                    specialty: s,
                }))}
                />
                <div
                ref={modalBodyRef}
                
                >
                <div className="custom-tab">
                    <Tab.Container defaultActiveKey={"addByDistance"}>
                    <Nav
                        variant="tabs"
                        className="justify-content-around"
                        style={{ marginTop: "5px", marginBottom: "5px" }}
                    >
                        <Nav.Link
                        className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-before"
                        eventKey="addByDistance"
                        onClick={() => setProviderType("addByDistance")}
                        >
                        Add Provider by Distance
                        </Nav.Link>
                        <Nav.Link
                        className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite"
                        eventKey="addByName"
                        onClick={() => setProviderType("addByName")}
                        >
                        Add Provider by Name
                        </Nav.Link>

                        <Nav.Link
                        className="new-provider-nav-link-hover-effect nav-link Pad8 tab-ite apply-after"
                        eventKey="addNotInDirectory"
                        onClick={() => setProviderType("addNotInDirectory")}
                        >
                        Add Provider not in Directory
                        </Nav.Link>
                    </Nav>
                    <div className="">
                        <Tab.Content>

                        <Tab.Pane
                            eventKey="addByDistance"
                            style={{
                            scrollbarWidth: "none",
                            }}
                        >
                            <Row
                            style={{ paddingLeft: "5px", paddingRight: "5px" }}
                            className="mx-0"
                            >
                            <Col md={12} className="p-0">
                                <div
                                className="row mx-0 align-items-center"
                                style={{
                                    marginBottom: "5px",
                                }}
                                >
                                <div className="col-md-12 pl-0 text-center  pr-0">
                                    <span
                                    className="text-center"
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--primary-25)",
                                    }}
                                    >
                                    Select a specialty and click search to find
                                    providers near the address you need.
                                    </span>
                                </div>
                                </div>
                            </Col>
                            </Row>
                            <AddressRow
                            label="Client 1"
                            addressKey="address1"
                            addressData={searchQueries?.address1}
                            dropdownState={dropdownState}
                            setDropdownState={setDropdownState}
                            selectedSpecialities={selectedSpecialities}
                            speciality={speciality}
                            handleSelectSpeciality={handleSelectSpeciality}
                            handleSearch={handleSearch}
                            searchQueries={searchQueries}
                            />

                            <AddressRow
                            label="Client 2"
                            addressKey="address2"
                            addressData={searchQueries?.address2}
                            dropdownState={dropdownState}
                            setDropdownState={setDropdownState}
                            selectedSpecialities={selectedSpecialities}
                            speciality={speciality}
                            handleSelectSpeciality={handleSelectSpeciality}
                            handleSearch={handleSearch}
                            searchQueries={searchQueries}
                            />

                            <AddressRow
                            label="Work"
                            addressKey="employment"
                            addressData={searchQueries?.employment}
                            dropdownState={dropdownState}
                            setDropdownState={setDropdownState}
                            selectedSpecialities={selectedSpecialities}
                            speciality={speciality}
                            handleSelectSpeciality={handleSelectSpeciality}
                            handleSearch={handleSearch}
                            searchQueries={searchQueries}
                            />

                            <AddressRow
                            label="Input"
                            addressKey="input"
                            addressData={searchQueries?.input}
                            dropdownState={dropdownState}
                            setDropdownState={setDropdownState}
                            selectedSpecialities={selectedSpecialities}
                            speciality={speciality}
                            handleSelectSpeciality={handleSelectSpeciality}
                            handleSearch={handleSearch}
                            isInputRow={true}
                            searchQueries={searchQueries}
                            setSearchQueries={setSearchQueries}
                            statesAbrs={statesAbrs}
                            setStateNewShow={setStateNewShow}
                            />

                            <Row className="mx-0">
                            <div
                                style={{
                                height: "174px",
                                overflowY: "auto",
                                width: "100%",
                                scrollbarWidth: "none",
                                }}
                            >
                                <table
                                className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25"
                                id="treatment-summary-table"
                                style={{ width: "100%" }}
                                >
                                <thead
                                    style={{
                                    position: "sticky",
                                    top: "0",
                                    }}
                                >
                                    <tr id="tb-header">
                                    <th
                                        style={{ width: "25px", maxWidth: "25px" }}
                                        className=" td-autosize color-grey-2 p-l-5 text-center"
                                    ></th>
                                    <th
                                        style={{ width: "25px", maxWidth: "25px" }}
                                        className=""
                                    >
                                        TF
                                    </th>
                                    {/* <th
                                        style={{
                                        maxWidth: "fit-content",
                                        width: "110px",
                                        }}
                                        className="text-center color-grey-2"
                                    >
                                        Specialty
                                    </th> */}

                                    <th
                                        style={{
                                        maxWidth: "fit-content",
                                        minWidth: "200px",
                                        }}
                                        className="text-center td-autosize color-grey-2"
                                    >
                                        Medical Provider
                                    </th>
                                    <th>Miles</th>
                                    <th className="text-center color-grey-2">
                                        Address
                                    </th>
                                    <th
                                        style={{
                                        width: "110px",
                                        }}
                                        className=" text-center color-grey-2"
                                    >
                                        Phone
                                    </th>
                                    </tr>
                                </thead>
                                {!isFavLoading ? (
                                    <tbody
                                    style={{
                                        maxHeight: "299px",
                                        overflowY: "auto",
                                        width: "100%",
                                        scrollbarWidth: "none",
                                    }}
                                    >
                                    {providerByDistanceData?.locations?.map(
                                        (loc, idx) => {
                                        return (
                                            <tr
                                            className={`has-speciality-color-${providerByDistanceData?.specialty?.id} height-25`}
                                            // className={``}
                                            id=""
                                            data-table_id={36}
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                selectedProviderByDistance
                                                    ?.location?.id ===
                                                loc?.location?.id
                                                    ? mixColorWithWhite(
                                                        providerByDistanceData
                                                        ?.specialty?.color,
                                                        10
                                                    )
                                                    : selectedProviderHover
                                                        ?.location?.id ===
                                                        loc?.location?.id
                                                    ? mixColorWithWhite(
                                                        providerByDistanceData
                                                            ?.specialty?.color,
                                                        3
                                                        )
                                                    : idx % 2 === 0
                                                        ? mixColorWithWhite(
                                                            providerByDistanceData
                                                            ?.specialty?.color,
                                                            2
                                                        )
                                                        : mixColorWithWhite(
                                                            providerByDistanceData
                                                            ?.specialty?.color,
                                                            4
                                                        ),
                                            }}
                                            onMouseEnter={() =>
                                                setSelectedProviderByHover(loc)
                                            }
                                            onMouseLeave={() =>
                                                setSelectedProviderByHover(null)
                                            }
                                            // onClick={() =>
                                            //   setSelectedProviderByDistance(loc)
                                            // }
                                            onClick={() =>
                                                selectedProviderByDistance?.location
                                                ?.id === loc?.location?.id
                                                ? setSelectedProviderByDistance(
                                                    {}
                                                    )
                                                : setSelectedProviderByDistance(
                                                    loc
                                                    )
                                            }
                                            >
                                            <td
                                                id="name-new-provider-column-star"
                                                className=" td-autosize color-black"
                                                style={{ height: "25px" }}
                                            >
                                                <div
                                                className="d-flex align-items-center"
                                                style={{ width: "fit-content" }}
                                                >
                                                <span
                                                    className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                                                    style={{
                                                    height: "25px",
                                                    }}
                                                >
                                                    <svg
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 25 25"
                                                    onClick={() =>
                                                        handleFav(
                                                        loc?.favorite,
                                                        loc
                                                        )
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    >
                                                    <path
                                                        d="M12.5 0L16 8.5L25 9L18 15L20 25L12.5 20L5 25L7 15L0 9L9 8.5Z"
                                                        fill={
                                                        loc?.favorite
                                                            ? "gold"
                                                            : "var(--primary-30)"
                                                        }
                                                    />
                                                    <text
                                                        x="12.5"
                                                        y="18"
                                                        textAnchor="middle"
                                                        fontSize="12px"
                                                        fontWeight="semi-bold"
                                                        fill="black"
                                                        style={{
                                                        fontWeight: "600",
                                                        }}
                                                    >
                                                        {idx + 1}
                                                    </text>
                                                    </svg>
                                                </span>
                                                </div>
                                            </td>
                                            <td></td>
                                            {/* <td
                                                className=" bg-speciality-10"
                                                style={{
                                                height: "25px",
                                        
                                                }}
                                            >
                                                <div
                                                className="d-flex p-r-5 align-items-center justify-content-start  bg-speciality-10"
                                                style={{
                                                    height: "25px",
                                                
                                                    color: "black",
                                                    fontWeight: "600",
                                                    gap: "5px",
                                                }}
                                                >
                                                <span
                                                    className={`d-flex align-items-center justify-content-center ${idx % 2 === 0 ? " bg-speciality" : " bg-speciality-98"}`}
                                                    style={{
                                                    height: "25px",
                                                    width: "25px",
                                        
                                                    color: "white",
                                                    fontSize: "16px",
                                                    }}
                                                >
                                                    {
                                                    providerByDistanceData
                                                        ?.specialty?.name[0]
                                                    }
                                                </span>
                                                {
                                                    providerByDistanceData
                                                    ?.specialty?.name
                                                }
                                                </div>
                                            </td> */}

                                            <td
                                                id="name-new-provider-column-name"
                                                className="text-left p-l-5 bg-speciality-10 color-black d-flex align-items-center"
                                                style={{
                                                height: "25px",
                                                fontWeight: "600",
                                                gap: "5px",
                                                }}
                                            >
                                                {/* <div
                                                className=" bg-speciality-10"
                                                style={{
                                                    height: "25px",
                                                    maxWidth: "fit-content",
                                                    // width: "110px",
                                                }}
                                                > */}
                                                <div
                                                className="d-flex p-r-5 align-items-center justify-content-start"
                                                style={{
                                                    height: "25px",

                                                    color: "black",
                                                    fontWeight: "600",
                                                    gap: "5px",
                                                }}
                                                >
                                                <span
                                                    className={`d-flex align-items-center justify-content-center ${idx % 2 === 0 ? " bg-speciality" : " bg-speciality-98"}`}
                                                    style={{
                                                    height: "25px",
                                                    width: "25px",
                                                    fontWeight: "700",
                                                    color: "white",
                                                    fontSize: "16px",
                                                    }}
                                                >
                                                    {
                                                    providerByDistanceData
                                                        ?.specialty?.name[0]
                                                    }
                                                </span>
                                                {loc?.provider}
                                                </div>
                                                {/* </div> */}
                                            </td>
                                            <td
                                                className=" td-autosize color-black"
                                                style={{
                                                height: "25px",
                                                fontWeight: "600",
                                                }}
                                            >
                                                {loc?.distance_km?.toFixed(1)}
                                            </td>
                                            <td
                                                className="color-black"
                                                id="name-new-provider-column-distance"
                                                style={{
                                                height: "25px",
                                                fontWeight: "600",
                                                }}
                                            >
                                                <div className="d-flex align-items-center height-25 ">
                                                {(() => {
                                                    const fullAddress = [
                                                    loc?.location?.address,
                                                    loc?.location?.address2,
                                                    `${loc?.location?.city || ""} ${loc?.location?.state || ""} ${loc?.location?.post_code || ""}`,
                                                    ]
                                                    .filter(Boolean)
                                                    .join(", ");
                                                    return fullAddress.length > 62
                                                    ? fullAddress.substring(
                                                        0,
                                                        62
                                                        ) + "..."
                                                    : fullAddress;
                                                })()}
                                                </div>
                                            </td>

                                            <td
                                                className="color-black text-left"
                                                style={{
                                                height: "25px",
                                                fontWeight: "600",
                                                }}
                                                id="phone-padding-tables-new-provider"
                                            >
                                                {formatPhoneNumber(
                                                loc?.location?.phone
                                                )}
                                            </td>
                                            </tr>
                                        );
                                        }
                                    )}
                                    {Array.from({
                                        length:
                                        12 -
                                        (providerByDistanceData?.locations
                                            ? providerByDistanceData?.locations
                                                ?.length
                                            : 0),
                                    }).map((_, index) => (
                                        <tr
                                        key={index}
                                        className="fake-rows-new-provider height-25"
                                        style={{
                                            background:
                                            providerByDistanceData?.locations
                                                ? mixColorWithWhite(
                                                    providerByDistanceData
                                                    ?.specialty?.color,
                                                    providerByDistanceData.locations
                                                    .length %
                                                    2 ===
                                                    0
                                                    ? index % 2 === 0
                                                        ? 2
                                                        : 4
                                                    : index % 2 === 0
                                                        ? 4
                                                        : 2
                                                )
                                                : index % 2 === 0
                                                ? "var(--primary-2)"
                                                : "var(--primary-4)",
                                        }}
                                        >
                                        <td colSpan={12}></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                ) : (
                                    <tbody
                                    style={{
                                        maxHeight: "299px",
                                        overflowY: "auto",
                                        width: "100%",
                                        scrollbarWidth: "none",
                                    }}
                                    >
                                    {Array.from({
                                        length: 12,
                                    }).map((_, index) => (
                                        <tr
                                        key={index}
                                        className="fake-rows-new-provider height-25"
                                        >
                                        <td colSpan={12}>
                                            <Box
                                            sx={{
                                                width: "100%",
                                                paddingTop: "0px",
                                                height: "25px",
                                                alignContent: "center",
                                            }}
                                            >
                                            <LinearProgress
                                                sx={{
                                                backgroundColor: "#8C9AAF", // Background track color
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor: "#19395f", // Progress bar color
                                                },
                                                }}
                                            />
                                            </Box>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                )}
                                </table>
                            </div>
                            </Row>
                        </Tab.Pane>

                        <Tab.Pane eventKey="addByName">
                            <Row
                            style={{ paddingLeft: "5px", paddingRight: "5px" }}
                            className="mx-0"
                            >
                            <Col md={12} className="p-0">
                                <div
                                className="row mx-0 align-items-center"
                                style={{
                                    marginBottom: "5px",
                                }}
                                >
                                <div className="col-md-12 pl-0 text-center  pr-0">
                                    <span
                                    className="text-center"
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--primary-25)",
                                    }}
                                    >
                                    Here you can search for a Medical provider
                                    directly by Name, Address, or phone number.
                                    </span>
                                </div>
                                </div>
                            </Col>
                            </Row>
                            <Row
                            style={{ paddingLeft: "5px", paddingRight: "5px" }}
                            className="mx-0"
                            >
                            <Col md={12} className="p-0">
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                <div className="col-md-12 pl-0 height-25 pr-0">
                                    <input
                                    type="text"
                                    placeholder="Type 3 Characters in a Provider Name, Address or Phone Number to Search for a Provider"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder =
                                        "Type 3 Characters in a Provider Name, Address or Phone Number to Search for a Provider";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    className="form-control height-25"
                                    value={searchProviderByName.providerName}
                                    onChange={(e) =>
                                        setSearchProviderByName({
                                        ...searchProviderByName,
                                        providerName: e.target.value,
                                        })
                                    }
                                    />
                                </div>
                                </div>
                            </Col>
                            </Row>

                            <Row className="mx-0">
                            <div
                                style={{
                                height: "264px",
                                overflowY: "auto",
                                width: "100%",
                                scrollbarWidth: "none",
                                }}
                            >
                                <table
                                className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25 h-100"
                                id="treatment-summary-table"
                                style={{ width: "100%" }}
                                >
                                <thead
                                    style={{
                                    position: "sticky",
                                    top: "0",
                                    }}
                                >
                                    <tr id="tb-header">
                                    <th
                                        style={{ width: "25px", maxWidth: "25px" }}
                                        className=" td-autosize color-grey-2 p-l-5 text-center"
                                    ></th>
                                    <th
                                        style={{ width: "25px", maxWidth: "25px" }}
                                        className=""
                                    >
                                        TF
                                    </th>
                                    {/* <th
                                        style={{
                                        maxWidth: "fit-content",
                                        width: "110px",
                                        }}
                                        className="text-center color-grey-2"
                                    >
                                        Specialty
                                    </th> */}

                                    <th
                                        style={{
                                        maxWidth: "fit-content",
                                        minWidth: "200px",
                                        }}
                                        className="text-center td-autosize color-grey-2"
                                    >
                                        Medical Provider
                                    </th>
                                    <th className="text-center color-grey-2">
                                        Address
                                    </th>
                                    <th
                                        style={{
                                        width: "110px",
                                        }}
                                        className=" text-center color-grey-2"
                                    >
                                        Phone
                                    </th>
                                    </tr>
                                </thead>
                                {!isFavNameLoading ? (
                                    <tbody
                                    style={{
                                        maxHeight: "374px",
                                        overflowY: "auto",
                                        width: "100%",
                                        scrollbarWidth: "none",
                                    }}
                                    >
                                    {providrerByNameData?.locations?.map(
                                        (loc, idx) => {
                                        return (
                                            <tr
                                            className={`height-25 has-speciality-color-${loc?.specialty?.id}`}
                                            id=""
                                            data-table_id={36}
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                selectedProviderByName?.location
                                                    ?.id === loc?.location?.id &&
                                                selectedProviderByName?.specialty
                                                    ?.id === loc?.specialty?.id
                                                    ? mixColorWithWhite(
                                                        loc?.specialty?.color,
                                                        10
                                                    )
                                                    : selectedProviderHover
                                                        ?.location?.id ===
                                                        loc?.location?.id &&
                                                        selectedProviderHover
                                                        ?.specialty?.id ===
                                                        loc?.specialty?.id
                                                    ? mixColorWithWhite(
                                                        loc?.specialty?.color,
                                                        3
                                                        )
                                                    : idx % 2 === 0
                                                        ? mixColorWithWhite(
                                                            loc?.specialty?.color,
                                                            2
                                                        )
                                                        : mixColorWithWhite(
                                                            loc?.specialty?.color,
                                                            4
                                                        ),
                                            }}
                                            onMouseEnter={() =>
                                                setSelectedProviderByHover(loc)
                                            }
                                            onMouseLeave={() =>
                                                setSelectedProviderByHover(null)
                                            }
                                            // onClick={() =>
                                            //   setSelectedProviderByName(loc)
                                            // }
                                            onClick={() =>
                                                selectedProviderByName?.location
                                                ?.id === loc?.location?.id
                                                ? setSelectedProviderByName({})
                                                : setSelectedProviderByName(loc)
                                            }
                                            >
                                            <td
                                                id="name-new-provider-column-star"
                                                className=" td-autosize color-black"
                                                style={{ height: "25px" }}
                                            >
                                                <div
                                                className="d-flex align-items-center"
                                                style={{ width: "fit-content" }}
                                                >
                                                <span
                                                    className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                                                    style={{
                                                    height: "25px",
                                                    }}
                                                >
                                                    {/* <FaStar
                                                    size={23}
                                                    color={
                                                        loc?.favorite
                                                        ? "gold"
                                                        : "var(--primary-30)"
                                                    }
                                                    onClick={() =>
                                                        handleFavName(
                                                        loc?.favorite,
                                                        loc
                                                        )
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    /> */}
                                                    <svg
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 25 25"
                                                    onClick={() =>
                                                        handleFavName(
                                                        loc?.favorite,
                                                        loc
                                                        )
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    >
                                                    <path
                                                        d="M12.5 0L16 8.5L25 9L18 15L20 25L12.5 20L5 25L7 15L0 9L9 8.5Z"
                                                        fill={
                                                        loc?.favorite
                                                            ? "gold"
                                                            : "var(--primary-30)"
                                                        }
                                                    />
                                                    <text
                                                        x="12.5"
                                                        y="18"
                                                        textAnchor="middle"
                                                        fontSize="12px"
                                                        fontWeight="semi"
                                                        fill="black"
                                                        style={{
                                                        fontWeight: "600",
                                                        }}
                                                    >
                                                        {idx + 1}
                                                    </text>
                                                    </svg>
                                                </span>
                                                </div>
                                            </td>
                                            <td className=""></td>
                                            {/* <td
                                                className=""
                                                style={{
                                                height: "25px",
                                                backgroundColor:
                                                    mixColorWithWhite(
                                                    loc?.specialty?.color,
                                                    10
                                                    ),
                                                }}
                                            >
                                                <div
                                                className="d-flex p-r-5 align-items-center justify-content-start "
                                                style={{
                                                    height: "25px",

                                                    backgroundColor:
                                                    mixColorWithWhite(
                                                        loc?.specialty?.color,
                                                        10
                                                    ),
                                                    color: "black",
                                                    fontWeight: "600",
                                                    gap: "5px",
                                                }}
                                                >
                                                <span
                                                    className="d-flex align-items-center justify-content-center"
                                                    style={{
                                                    height: "25px",
                                                    width: "25px",
                                                    backgroundColor:
                                                        loc?.specialty?.color,
                                                    color: "white",
                                                    fontSize: "16px",
                                                    }}
                                                >
                                                    {loc?.specialty?.name[0]}
                                                </span>
                                                {loc?.specialty?.name}
                                                </div>
                                            </td> */}

                                            <td
                                                id="name-new-provider-column-name"
                                                className="text-left color-black"
                                                style={{ fontWeight: "600" }}
                                            >
                                                <div
                                                className="d-flex p-r-5 align-items-center bg-speciality-10 justify-content-start "
                                                style={{
                                                    height: "25px",

                                                    // backgroundColor:
                                                    //   mixColorWithWhite(
                                                    //     loc?.specialty?.color,
                                                    //     10
                                                    //   ),
                                                    color: "black",
                                                    fontWeight: "600",
                                                    gap: "5px",
                                                }}
                                                >
                                                <span
                                                    className="d-flex bg-speciality align-items-center justify-content-center"
                                                    style={{
                                                    height: "25px",
                                                    width: "25px",
                                                    // backgroundColor:
                                                    //   loc?.specialty?.color,
                                                    color: "white",
                                                    fontWeight: "700",
                                                    fontSize: "16px",
                                                    }}
                                                >
                                                    {loc?.specialty?.name[0]}
                                                </span>
                                                {loc?.provider}
                                                </div>
                                            </td>
                                            <td
                                                id="name-new-provider-column"
                                                className="color-black"
                                                style={{
                                                height: "25px",
                                                fontWeight: "600",
                                                }}
                                            >
                                                <div className="d-flex align-items-center height-25 ">
                                                {(() => {
                                                    const streetAddress = [
                                                    loc?.location?.address,
                                                    loc?.location?.address2,
                                                    ]
                                                    .filter(Boolean)
                                                    .join(" "); // use space instead of comma

                                                    const cityStateZip = [
                                                    loc?.location?.city,
                                                    loc?.location?.state,
                                                    loc?.location?.post_code,
                                                    ]
                                                    .filter(Boolean)
                                                    .join(","); // combine with spaces

                                                    const fullAddress = [
                                                    streetAddress,
                                                    cityStateZip,
                                                    ]
                                                    .filter(Boolean)
                                                    .join(", ");
                                                    return fullAddress.length > 90
                                                    ? fullAddress.substring(
                                                        0,
                                                        90
                                                        ) + "..."
                                                    : fullAddress;
                                                })()}
                                                </div>
                                            </td>

                                            <td
                                                className="color-black text-left"
                                                style={{ fontWeight: "600" }}
                                                id="phone-padding-tables-new-provider"
                                            >
                                                {formatPhoneNumber(
                                                loc?.location?.phone
                                                )}
                                            </td>
                                            </tr>
                                        );
                                        }
                                    )}
                                    {Array.from({
                                        length:
                                        additionalRows -
                                        (providrerByNameData?.locations
                                            ? providrerByNameData?.locations?.length
                                            : 0),
                                    }).map((_, index) => (
                                        <tr
                                        key={index}
                                        className="fake-rows-new-provider height-25"
                                        >
                                        <td colSpan={12}></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                ) : (
                                    <tbody
                                    style={{
                                        overflowY: "auto",
                                        width: "100%",
                                        scrollbarWidth: "none",
                                    }}
                                    >
                                    {Array.from({
                                        length: 16,
                                    }).map((_, index) => (
                                        <tr
                                        key={index}
                                        className="fake-rows-new-provider height-25"
                                        >
                                        <td colSpan={12}>
                                            <Box
                                            sx={{
                                                width: "100%",
                                                paddingTop: "0px",
                                                height: "25px",
                                                alignContent: "center",
                                            }}
                                            >
                                            <LinearProgress
                                                sx={{
                                                backgroundColor: "#8C9AAF", // Background track color
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor: "#19395f", // Progress bar color
                                                },
                                                }}
                                            />
                                            </Box>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                )}
                                </table>
                            </div>
                            </Row>
                        </Tab.Pane>

                        <Tab.Pane
                            style={{
                            scrollbarWidth: "none",
                            }}
                            eventKey="addNotInDirectory"
                        >
                            <Row
                            style={{ paddingLeft: "5px", paddingRight: "5px" }}
                            className="mx-0"
                            >
                            <Col md={12} className="p-0">
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                <div className="col-md-12 pl-0 text-center  pr-0">
                                    <span
                                    className="text-center"
                                    style={{
                                        fontWeight: "600",
                                        color: "var(--primary-25)",
                                    }}
                                    >
                                    Input a provider not in the Treatment First
                                    directory here. Possible matches will show
                                    below.
                                    </span>
                                </div>
                                </div>
                            </Col>
                            </Row>

                            <Row
                            style={{ paddingLeft: "5px", paddingRight: "5px" }}
                            className="mx-0"
                            >
                            <Col md={12} className="p-0">
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                <div
                                    ref={specialProviderRef}
                                    // className=""
                                    className={`col-md-4 height-25 p-l-0 pr-0 custom-select-new-provider`}
                                >
                                    <div
                                    className="dropdown-button form-control pt-0 pb-0  pr-0 rounded-0 height-25 d-flex align-items-center"
                                    onClick={() =>
                                        setDropdownOpenManual((prev) => !prev)
                                    }
                                    style={{
                                        paddingLeft: selectedSpecialityManual
                                        ? "0px"
                                        : "5px",
                                        backgroundColor: selectedSpecialityManual
                                        ? selectedSpecialityManual?.color
                                        : "white",
                                    }}
                                    >
                                    <span id="selectedOption">
                                        {selectedSpecialityManual ? (
                                        <div
                                            className="d-flex p-l-5 align-items-center justify-content-start "
                                            style={{
                                            height: "25px",
                                            fontSize: "16px",
                                            color: "white",
                                            fontWeight: "700",
                                            gap: "5px",
                                            }}
                                        >
                                            {/* <span
                                            className="d-flex align-items-center justify-content-center"
                                            style={{
                                                height: "25px",
                                                width: "25px",
                                                backgroundColor:
                                                selectedSpecialityManual?.color,
                                                color: "white",
                                                fontWeight: "600",
                                                fontSize: "16px",
                                            }}
                                            >
                                            {selectedSpecialityManual?.name[0]}
                                            </span> */}
                                            {selectedSpecialityManual?.name}
                                        </div>
                                        ) : (
                                        // <div className="d-flex align-items-center">
                                        //   {selectedSpecialityManual?.name}
                                        // </div>
                                        "Select Specialty"
                                        )}
                                    </span>
                                    </div>

                                    {/* Dropdown menu */}
                                    {dropdownOpenManual && (
                                    <div
                                        className="dropdown-menu p-0 mt-0"
                                        style={{
                                        width: "100%",
                                        border: "1px solid #ced4da",
                                        // borderRadius: "2px",
                                        scrollbarWidth: "none",
                                        maxHeight: "315px",
                                        fontSize: "16px",
                                        overflowY: "auto",
                                        }}
                                    >
                                        {speciality?.map((special) => (
                                        <div
                                            className={`has-speciality-color-${special?.id}`}
                                        >
                                            <div
                                            key={special.id}
                                            className="dropdown-option bg-speciality d-flex align-items-center height-25"
                                            style={{
                                                // backgroundColor: mixColorWithWhite(
                                                //   special?.color,
                                                //   10
                                                // ),
                                                color: "white",
                                                fontWeight: "700",
                                                fontSize: "16px",
                                                cursor: "pointer",
                                                paddingLeft: "5px",
                                            }}
                                            onClick={() =>
                                                handleSelectManual(special)
                                            }
                                            >
                                            <ClientProvidersStyles
                                                clientProviders={[
                                                {
                                                    specialty: {
                                                    ...special,
                                                    },
                                                },
                                                ]}
                                            />
                                            {/* <span
                                                className="m-r-5 d-flex bg-speciality align-items-center justify-content-center text-white"
                                                style={{
                                                width: "25px",
                                                height: "25px",
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                }}
                                            >
                                                {special?.name[0]}
                                            </span> */}
                                            {special.name}
                                            </div>
                                        </div>
                                        ))}
                                    </div>
                                    )}
                                </div>

                                <div
                                    className="col-md-7 height-25 p-l-5 pr-0"
                                    style={{
                                    maxWidth: "614px",
                                    marginRight: "5px",
                                    }}
                                >
                                    <input
                                    type="text"
                                    placeholder="Provider Name"
                                    className="form-control p-0 p-l-5 rounded-0 height-25"
                                    value={addProviderByManual.providerName}
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder = "Provider Name";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    onChange={(e) =>
                                        setAddProviderByManual({
                                        ...addProviderByManual,
                                        providerName: e.target.value,
                                        })
                                    }
                                    />
                                </div>
                                <Button
                                    variant={
                                    addProviderByManual.providerName === "" &&
                                    addProviderByManual.providerSpeciality === ""
                                        ? "secondary"
                                        : "success"
                                    }
                                    disabled={
                                    addProviderByManual.providerName === "" &&
                                    addProviderByManual.providerSpeciality === ""
                                    }
                                    style={{
                                    cursor:
                                        addProviderByManual.providerName === "" &&
                                        addProviderByManual.providerSpeciality ===
                                        ""
                                        ? "not-allowed"
                                        : "pointer",
                                    minWidth: "94px",
                                    }}
                                    onClick={handleAdditionByManualByNameSpeciality}
                                    className="button-padding-footer-new-provider height-25 padding-button-provider d-flex align-items-center justify-content-center "
                                >
                                    Add to Case
                                </Button>
                                </div>
                            </Col>
                            </Row>

                            <Row
                            style={{ paddingLeft: "5px", paddingRight: "5px" }}
                            className="mx-0"
                            >
                            <Col md={12} className="p-0">
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                <div className="col-md-4 p-l-0 height-25 pr-0">
                                    <input
                                    type="text"
                                    placeholder="Address 1"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder = "Address 1";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    value={addProviderByManual.providerAddress1}
                                    onChange={(e) =>
                                        setAddProviderByManual({
                                        ...addProviderByManual,
                                        providerAddress1: e.target.value,
                                        })
                                    }
                                    />
                                </div>

                                <div className="p-l-5 col-md-3 height-25 p-r-5">
                                    <input
                                    type="text"
                                    placeholder="Address 2"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder = "Address 2";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    value={addProviderByManual.providerAddress2}
                                    onChange={(e) =>
                                        setAddProviderByManual({
                                        ...addProviderByManual,
                                        providerAddress2: e.target.value,
                                        })
                                    }
                                    />
                                </div>

                                <div className="col-md-3 height-25 p-l-0 pr-0">
                                    <input
                                    type="text"
                                    placeholder="City"
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder = "City";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    value={addProviderByManual.providerCity}
                                    onChange={(e) =>
                                        setAddProviderByManual({
                                        ...addProviderByManual,
                                        providerCity: e.target.value,
                                        })
                                    }
                                    />
                                </div>

                                <div className="col-md-1 height-25 p-l-5 pr-0 custom-select-new-provider">
                                    <div
                                    className="dropdown-button rounded-0 p-0 p-l-5 p-r-5 form-control height-25 d-flex align-items-center"
                                    onClick={handleStateShow}
                                    >
                                    <span id="selectedOption">
                                        {specialStates.includes(
                                        addProviderByManual?.providerState
                                        ) ? (
                                        <div className="d-flex align-items-center">
                                            {React.createElement(
                                            stateMap[
                                                addProviderByManual.providerState
                                            ]
                                            )}
                                            {addProviderByManual?.providerState}
                                        </div>
                                        ) : addProviderByManual?.providerState ? (
                                        <div className="d-flex align-items-center">
                                            <svg
                                            style={{
                                                width: "15px",
                                                height: "15px",
                                                fill: "var(--primary-80)",
                                                color: "var(--primary-80)",
                                                stroke: "var(--primary-80)",
                                            }}
                                            className={`icon icon-state-${addProviderByManual?.providerState}`}
                                            >
                                            <use
                                                xlinkHref={`#icon-state-${addProviderByManual?.providerState}`}
                                            ></use>
                                            </svg>
                                            {addProviderByManual?.providerState}
                                        </div>
                                        ) : (
                                        "State"
                                        )}
                                    </span>
                                    </div>
                                </div>

                                <div className="col-md-1 height-25 p-l-5 pr-0">
                                    <input
                                    type="text"
                                    placeholder="Zip"
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder = "Zip";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    value={addProviderByManual.providerZip}
                                    onChange={(e) =>
                                        setAddProviderByManual({
                                        ...addProviderByManual,
                                        providerZip: e.target.value,
                                        })
                                    }
                                    />
                                </div>
                                </div>
                            </Col>
                            </Row>

                            <Row
                            style={{ paddingLeft: "5px", paddingRight: "5px" }}
                            className="mx-0"
                            >
                            <Col md={12} className="p-0">
                                <div className="row mx-0 align-items-center custom-margin-bottom">
                                <div
                                    className="col-md-2 height-25 p-l-0 p-r-5"
                                    style={{
                                    minWidth: "181px",
                                    }}
                                >
                                    <input
                                    type="text"
                                    placeholder="Phone: (###) ###-####"
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder =
                                        "Phone: (###) ###-####";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    value={addProviderByManual.providerPhone}
                                    onChange={handlePhoneInput}
                                    />
                                </div>

                                <div
                                    className="col-md-2 height-25 p-l-0 p-r-5"
                                    style={{
                                    minWidth: "181px",
                                    }}
                                >
                                    <input
                                    type="text"
                                    placeholder="Fax: (###) ###-####"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder =
                                        "Fax: (###) ###-####";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    value={addProviderByManual.providerFax}
                                    onChange={handleFaxInput}
                                    />
                                </div>
                                <div
                                    className="col-md-4 height-25 p-l-0 pr-0"
                                    style={{
                                    maxWidth: "351.5px",
                                    }}
                                >
                                    <input
                                    type="text"
                                    placeholder="Email: someone@providerurl.com"
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder =
                                        "Email: someone@providerurl.com";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    value={addProviderByManual.providerEmail}
                                    onChange={(e) => {
                                        setAddProviderByManual({
                                        ...addProviderByManual,
                                        providerEmail: e.target.value,
                                        });
                                    }}
                                    />
                                </div>

                                <div
                                    className="col-md-4 height-25 p-l-5 pr-0 "
                                    style={{
                                    maxWidth: "356.5px",
                                    }}
                                >
                                    <input
                                    type="text"
                                    placeholder="Website: www.providerurl.com"
                                    className="form-control height-25 p-0 p-l-5 rounded-0"
                                    onFocus={(e) => {
                                        e.target.placeholder = "";
                                        e.target.style.color = "black";
                                    }}
                                    onBlur={(e) => {
                                        e.target.placeholder =
                                        "Website: www.providerurl.com";
                                    }}
                                    style={{ color: "var(--primary-25)" }}
                                    value={addProviderByManual.providerWebsite}
                                    onChange={(e) => {
                                        setAddProviderByManual({
                                        ...addProviderByManual,
                                        providerWebsite: e.target.value,
                                        });
                                    }}
                                    />
                                </div>
                                </div>
                            </Col>
                            </Row>

                            <Row className="mx-0">
                            <div
                                style={{
                                height: "204px",
                                overflowY: "auto",
                                width: "100%",
                                scrollbarWidth: "none",
                                }}
                            >
                                <table
                                className="table table-borderless table-striped table-treatment has-specialty-icon has-height-25"
                                id="treatment-summary-table"
                                style={{ width: "100%" }}
                                >
                                <thead
                                    style={{
                                    position: "sticky",
                                    top: "0",
                                    }}
                                >
                                    <tr id="tb-header">
                                    <th
                                        style={{ width: "25px", maxWidth: "25px" }}
                                        className=" td-autosize color-grey-2 p-l-5 text-center"
                                    ></th>
                                    <th
                                        style={{ width: "25px", maxWidth: "25px" }}
                                        className=""
                                    >
                                        TF
                                    </th>
                                    {/* <th
                                        style={{
                                        maxWidth: "fit-content",
                                        width: "110px",
                                        }}
                                        className="text-center color-grey-2"
                                    >
                                        Specialty
                                    </th> */}

                                    <th
                                        style={{
                                        maxWidth: "fit-content",
                                        minWidth: "200px",
                                        }}
                                        className="text-center td-autosize color-grey-2"
                                    >
                                        Medical Provider
                                    </th>
                                    <th className="text-center color-grey-2">
                                        Address
                                    </th>
                                    <th
                                        style={{
                                        width: "110px",
                                        }}
                                        className=" text-center color-grey-2"
                                    >
                                        Phone
                                    </th>
                                    </tr>
                                </thead>
                                {!isFavDirectoryLoading ? (
                                    <tbody
                                    style={{
                                        overflowY: "auto",
                                        width: "100%",
                                        scrollbarWidth: "none",
                                    }}
                                    >
                                    {providerByDirectoryData?.locations?.map(
                                        (loc, idx) => {
                                        return (
                                            <tr
                                            className={`height-25 has-speciality-color-${loc?.specialty?.id}`}
                                            id=""
                                            data-table_id={36}
                                            style={{
                                                cursor: "pointer",
                                                backgroundColor:
                                                selectedProviderDirectory
                                                    ?.location?.id ===
                                                    loc?.location?.id &&
                                                selectedProviderDirectory
                                                    ?.specialty?.id ===
                                                    loc?.specialty?.id
                                                    ? mixColorWithWhite(
                                                        loc?.specialty?.color,
                                                        10
                                                    )
                                                    : selectedProviderHover
                                                        ?.location?.id ===
                                                        loc?.location?.id &&
                                                        selectedProviderHover
                                                        ?.specialty?.id ===
                                                        loc?.specialty?.id
                                                    ? mixColorWithWhite(
                                                        loc?.specialty?.color,
                                                        3
                                                        )
                                                    : idx % 2 === 0
                                                        ? mixColorWithWhite(
                                                            loc?.specialty?.color,
                                                            2
                                                        )
                                                        : mixColorWithWhite(
                                                            loc?.specialty?.color,
                                                            4
                                                        ),
                                            }}
                                            onMouseEnter={() =>
                                                setSelectedProviderByHover(loc)
                                            }
                                            onMouseLeave={() =>
                                                setSelectedProviderByHover(null)
                                            }
                                            // onClick={() =>
                                            //   setSelectedProviderDirectory(loc)
                                            // }
                                            onClick={() =>
                                                selectedProviderDirectory?.location
                                                ?.id === loc?.location?.id
                                                ? setSelectedProviderDirectory({})
                                                : setSelectedProviderDirectory(
                                                    loc
                                                    )
                                            }
                                            >
                                            <td
                                                id="name-new-provider-column-star"
                                                className=" td-autosize color-black"
                                                style={{ height: "25px" }}
                                            >
                                                <div
                                                className="d-flex align-items-center"
                                                style={{ width: "fit-content" }}
                                                >
                                                <span
                                                    className="d-flex align-items-center justify-content-center text-center text-white specialty-icon"
                                                    style={{
                                                    height: "25px",
                                                    }}
                                                >
                                                    <svg
                                                    width="25"
                                                    height="25"
                                                    viewBox="0 0 25 25"
                                                    onClick={() =>
                                                        handleFavDirectory(
                                                        loc?.favorite,
                                                        loc
                                                        )
                                                    }
                                                    style={{ cursor: "pointer" }}
                                                    >
                                                    <path
                                                        d="M12.5 0L16 8.5L25 9L18 15L20 25L12.5 20L5 25L7 15L0 9L9 8.5Z"
                                                        fill={
                                                        loc?.favorite
                                                            ? "gold"
                                                            : "var(--primary-30)"
                                                        }
                                                    />
                                                    <text
                                                        x="12.5"
                                                        y="18"
                                                        textAnchor="middle"
                                                        fontSize="12px"
                                                        fontWeight="semi"
                                                        fill="black"
                                                        style={{
                                                        fontWeight: "600",
                                                        }}
                                                    >
                                                        {idx + 1}
                                                    </text>
                                                    </svg>
                                                </span>
                                                </div>
                                            </td>
                                            <td className=""></td>

                                            <td
                                                id="name-new-provider-column-name"
                                                className="text-left color-black bg-speciality-10"
                                                style={{ fontWeight: "600" }}
                                            >
                                                <div
                                                className="d-flex p-r-5 align-items-center bg-speciality-10 justify-content-start "
                                                style={{
                                                    height: "25px",

                                                    color: "black",
                                                    fontWeight: "600",
                                                    gap: "5px",
                                                }}
                                                >
                                                <span
                                                    className="d-flex align-items-center bg-speciality justify-content-center"
                                                    style={{
                                                    height: "25px",
                                                    width: "25px",
                                                    // backgroundColor:
                                                    //   loc?.specialty?.color,
                                                    color: "white",
                                                    fontSize: "16px",
                                                    fontWeight: "700",
                                                    }}
                                                >
                                                    {loc?.specialty?.name[0]}
                                                </span>
                                                {loc?.provider}
                                                </div>
                                            </td>
                                            <td
                                                id="name-new-provider-column"
                                                className="color-black"
                                                style={{
                                                height: "25px",
                                                fontWeight: "600",
                                                }}
                                            >
                                                <div className="d-flex align-items-center height-25 ">
                                                {(() => {
                                                    const fullAddress = [
                                                    loc?.location?.address,
                                                    loc?.location?.address2,
                                                    `${loc?.location?.city || ""} ${loc?.location?.state || ""} ${loc?.location?.post_code || ""}`,
                                                    ]
                                                    .filter(Boolean)
                                                    .join(", ");
                                                    return fullAddress.length > 60
                                                    ? fullAddress.substring(
                                                        0,
                                                        60
                                                        ) + "..."
                                                    : fullAddress;
                                                })()}
                                                </div>
                                            </td>

                                            <td
                                                className="color-black text-left"
                                                style={{ fontWeight: "600" }}
                                                id="phone-padding-tables-new-provider"
                                            >
                                                {formatPhoneNumber(
                                                loc?.location?.phone
                                                )}
                                            </td>
                                            </tr>
                                        );
                                        }
                                    )}
                                    {Array.from({
                                        length:
                                        13 -
                                        (providerByDirectoryData?.locations
                                            ? providerByDirectoryData?.locations
                                                ?.length
                                            : 0),
                                    }).map((_, index) => (
                                        <tr
                                        key={index}
                                        className="fake-rows-new-provider height-25"
                                        >
                                        <td colSpan={12}></td>
                                        </tr>
                                    ))}
                                    </tbody>
                                ) : (
                                    <tbody
                                    style={{
                                        maxHeight: "350px",
                                        overflowY: "auto",
                                        width: "100%",
                                        scrollbarWidth: "none",
                                    }}
                                    >
                                    {Array.from({
                                        length: 13,
                                    }).map((_, index) => (
                                        <tr
                                        key={index}
                                        className="fake-rows-new-provider height-25"
                                        >
                                        <td colSpan={12}>
                                            <Box
                                            sx={{
                                                width: "100%",
                                                paddingTop: "0px",
                                                height: "25px",
                                                alignContent: "center",
                                            }}
                                            >
                                            <LinearProgress
                                                sx={{
                                                backgroundColor: "#8C9AAF", // Background track color
                                                "& .MuiLinearProgress-bar": {
                                                    backgroundColor: "#19395f", // Progress bar color
                                                },
                                                }}
                                            />
                                            </Box>
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                )}
                                </table>
                            </div>
                            </Row>
                        </Tab.Pane>

                        </Tab.Content>
                    </div>
                    </Tab.Container>
                </div>
                </div>
                {providerType === "addByName" && (
                <div
                    className="d-flex justify-content-center align-items-center p-0 mt-0 p-t-5"
                    style={{ borderTop: "none" }}
                >
                    {/* <Button
                    className="button-padding-footer-new-provider d-flex align-items-center justify-content-center height-25 "
                    variant="secondary"
                    onClick={() => handleClose(false)}
                    >
                    Cancel
                    </Button> */}
                    <Button
                    variant={
                        Object.keys(selectedProviderByName).length > 0
                        ? "success"
                        : "secondary"
                    }
                    disabled={Object.keys(selectedProviderByName).length === 0}
                    style={{
                        cursor:
                        Object.keys(selectedProviderByName).length === 0
                            ? "not-allowed"
                            : "pointer",
                        minWidth: "108px",
                    }}
                    className="button-padding-footer-new-provider d-flex align-items-center justify-content-center height-25 "
                    onClick={handleProviderAdditionByName}
                    >
                    Add to Case
                    </Button>
                </div>
                )}
                {providerType === "addByDistance" && (
                <div
                    className="d-flex justify-content-center align-items-center p-0 mt-0 p-t-5"
                    style={{ borderTop: "none" }}
                >
                    {/* <Button
                    className="button-padding-footer-new-provider d-flex align-items-center justify-content-center height-25 "
                    variant="secondary"
                    onClick={() => handleClose(false)}
                    >
                    Cancel
                    </Button> */}
                    <Button
                    variant={
                        Object.keys(selectedProviderByDistance)?.length > 0
                        ? "success"
                        : "secondary"
                    }
                    disabled={
                        Object.keys(selectedProviderByDistance)?.length === 0
                    }
                    style={{
                        cursor:
                        Object.keys(selectedProviderByDistance)?.length === 0
                            ? "not-allowed"
                            : "pointer",
                        minWidth: "108px",
                    }}
                    className="button-padding-footer-new-provider d-flex align-items-center justify-content-center height-25 "
                    onClick={handleAdditionByDistance}
                    >
                    Add to Case
                    </Button>
                </div>
                )}
                {providerType === "addNotInDirectory" && (
                <div
                    className="d-flex justify-content-center align-items-center p-0 mt-0 p-t-5"
                    style={{ borderTop: "none" }}
                >
                    {/* <Button
                    className="button-padding-footer-new-provider d-flex align-items-center justify-content-center height-25 "
                    variant="secondary"
                    onClick={() => handleClose(false)}
                    >
                    Cancel
                    </Button> */}
                    {/* <span
                    className="text-center"
                    style={{ fontWeight: "600", color: "var(--primary)" }}
                >
                    Specialty Provider Name in City, State found in directory.
                </span> */}
                    <Button
                    variant={
                        Object.keys(selectedProviderDirectory).length === 0
                        ? "secondary"
                        : "success"
                    }
                    disabled={Object.keys(selectedProviderDirectory).length === 0}
                    style={{
                        cursor:
                        Object.keys(selectedProviderDirectory).length === 0
                            ? "not-allowed"
                            : "pointer",
                        minWidth: "108px",
                    }}
                    onClick={handleAdditionByManual}
                    className="button-padding-footer-new-provider d-flex align-items-center justify-content-center height-25 "
                    >
                    Add to Case
                    </Button>
                </div>
                )}
            </div>
            // </Modal>
        )}
        {stateShow && (
            <SelectStateModal
            show={stateShow}
            handleClose={handleStateShow}
            // onChange={onChange}
            onChange={(state) =>
                setAddProviderByManual({
                ...addProviderByManual,
                providerState: state.StateAbr,
                })
            }
            statesData={statesAbrs}
            />
        )}
        {/* {addRedirectedBackPopup && (
            <>
            <AddRedirectBackPopUp
                show={addRedirectedBackPopup.show}
                handleClose={() => {
                setAddRedirectedBackPopup({
                    show: false,
                });
                handleClose("true"); // Close parent and trigger refresh
                }}
                data={addRedirectedBackPopup}
                firmName={firmName}
            />
            </>
        )} */}
        </>
    );
}

export default React.memo(AddProviderLienPopup);




