import React, {
    useCallback,
    useEffect,
    useState,
    useRef,
    useReducer,
    useMemo,
} from "react";

import {
    DocumentEditorContainerComponent,
    Toolbar,
    DocumentEditorComponent, Selection, Editor, EditorHistory, ContextMenu

} from "@syncfusion/ej2-react-documenteditor";

import { getToken, getLoggedInUserId } from "../../Utils/helper";
import Select from 'react-select'
import './wordprocessor.css'

import { ToolbarComponent, ItemDirective, ItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DropDownButtonComponent, ItemModel } from '@syncfusion/ej2-react-splitbuttons';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import api, { api_without_cancellation } from "../../api/api";
import axios from "axios";


DocumentEditorContainerComponent.Inject(Toolbar, Selection, Editor, EditorHistory, ContextMenu);

function WPBase({
    docId,
    updatedDocId,
    dynamicTemplateId,
    setPageId,
    setDropdownId,
    setDocName,
    state,
    dispatch,
    container,
    controls,
    type
}) {







    const userId = getLoggedInUserId();
    const [isPropertyPaneReady, setIsPropertyPaneReady] = useState(false);

    const [dropdownPages, setDropdownPages] = useState([]);
    const [selectedPageOption, setSelectedPageOption] = useState(null);


    const [dropdownVariables, setDropdownVariables] = useState([]);

    const [footerKey, setFooterKey] = useState(0);

    const [renameDoc, setRenameDoc] = useState("");



    const reloadFooter = () => {
        setFooterKey(prevKey => prevKey + 1);  // Update key to trigger re-render
    };












    const origin =
        process.env.REACT_APP_BACKEND_URL || "https://dev.simplefirm.com";
    const token = getToken();



    const loadFile = useCallback(
        async (file) => {
            try {
                const ajax = new XMLHttpRequest();
                ajax.open("POST", container.current?.serviceUrl + "Import", true);
                ajax.onreadystatechange = () => {
                    if (ajax.readyState === 4 && ajax.status === 200) {
                        container.current?.documentEditor.open(ajax.responseText);
                        dispatch({ type: "SET_LOADING", payload: false });
                    } else if (ajax.readyState === 4) {
                        dispatch({ type: "SET_ERROR", payload: true });
                    }
                };
                const formData = new FormData();
                formData.append("files", file);
                ajax.send(formData);
            } catch (error) {
                dispatch({ type: "SET_ERROR", payload: true });
            }
        },
        [container]
    );

    const getDocument = useCallback(async () => {
        try {
            const response = await api_without_cancellation.get(`${origin}/api/getDocFile/?doc_id=${updatedDocId?(updatedDocId):(docId)}`);
            if (response.status == 200) {
                console.log("doc", response)
                const fileResponse = await fetch(response?.data?.upload);
                const fileBlob = await fileResponse.blob();
                loadFile(fileBlob);

            }

            // }
        } catch (error) {
            console.log("error", error)
            dispatch({ type: "SET_ERROR", payload: true });
        }
    }, [loadFile]);

    const handlePageChange = (option) => {
        setSelectedPageOption(option);
        documentVariables(option.value)
    };

    const handleVariableChange = (val) => {
        if (container.current && container.current.documentEditor) {
            const editor = container.current.documentEditor.editor;
            editor.insertText(val); // Insert the value where the cursor is located
        }
    };


    const autoSaveContent = useCallback(async () => {
        if (container.current) {
            // Get the document content as SFDT format (Syncfusion Document Text)
            const content = await container.current.documentEditor.saveAsBlob("Docx");
            try {
                const response = await api_without_cancellation.post(`${origin}/api/update-edit-doc/`, { doc_id: docId, file: content },
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                if (response.status == 200) {
                    console.log("Document autosaved");
                }

            } catch (error) {
                console.error("Error autosaving document:", error);
            } finally {
            }

        }
    });


    const getTemplateData = async (options) => {
        try {
            const response = await api_without_cancellation.get(
                `/api/firmsetting-page/edit-dl-template/`,
                {
                    params: {
                        template_id: dynamicTemplateId,
                    },
                }
            );
            if (response.status == 200) {
                const page_id = response.data?.for_page?.id
                const dropdown_id = response.data?.for_dropdown?.id
                const temp_name = response.data?.for_template?.template_name
                const doc_name = response.data?.for_template?.template?.file_name


                const copy_temp_name = temp_name + "-copy"

                setPageId(page_id)
                setDropdownId(dropdown_id)

                setDocName(doc_name)
                setRenameDoc(doc_name)



                dispatch({
                    type: "SET_TEMP_NAME",
                    payload: temp_name,
                });


                dispatch({ type: "SET_FILENAME", payload: copy_temp_name })
                dispatch({ type: "SET_UPDATED_FILENAME", payload: copy_temp_name });

                let optionSelect = options.find(option => option.value === page_id);
                setSelectedPageOption(optionSelect)
                documentVariables(page_id)
            }
            console.log("template data", response.data)

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        // Append custom select dropdown to the property tab once it's rendered
        if (container.current) {
            const element = document.querySelector('.e-de-ctnr-properties-pane-btn.e-de-pane-disable-clr');
            if (element) {
                element.classList.add('d-none');
            }
            componentDidMount()

        }
        setIsPropertyPaneReady(true); // Property tab is ready for rendering the select component
        documentPages();

    }, []);



    const documentPages = async () => {
        try {

            const response = await api_without_cancellation.get(`${origin}/api/firmsetting-page/get-document-variables-pages/`);

            if (response.status === 200) {
                var data = response.data
                const optionPages = [
                    {
                        value: 'all', // or another value of your choice
                        label: 'All'
                    },
                    ...data.map(item => ({
                        value: item.id,   // map to `value`
                        label: (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={item.page_icon}
                                    alt="icon"
                                    style={{ width: '20px', marginRight: '8px' }}
                                />
                                {item.name}
                            </div>
                        ),
                    })),
                ];
                setDropdownPages(optionPages)
                getTemplateData(optionPages);
            }



        } catch {
            setDropdownPages([])
        }

    }

    const documentVariables = async (page_id) => {
        try {

            const response = await api_without_cancellation.get(`${origin}/api/firmsetting-page/get-document-variables/?page_id=` + page_id);

            if (response.status === 200) {
                var data = response.data
                setDropdownVariables(data)
            }

        } catch {

            setDropdownVariables([])

        }

    }


    const renameDocFileName = async () => {
        try {

            const formData = new FormData();
            formData.append("doc_id", docId);
            formData.append("file_name", renameDoc);

            const response = await api_without_cancellation.post(`${origin}/api/rename-doc-wp/`, formData);
            if (response.status == 200) {
                if (response.data.success) {
                    dispatch({
                        type: "SHOW_MODAL",
                        payload: `${renameDoc} renamed successfully!`,
                    });
                    setDocName(renameDoc)


                }

            }

        } catch (error) {
            console.error("An error occurred:", error);
        }

    }








    useEffect(() => {
        if (container.current) {
            getDocument();
        }
    }, [getDocument]);





    const toolbarItems = useMemo(() => {
        const baseItems = [
            "New",
            "Open",
            "Separator",
            "Undo",
            "Redo",
            "Separator",
            "Image",
            "Table",
            "Hyperlink",
            "Bookmark",
            "TableOfContents",
            "Separator",
            "Header",
            "Footer",
            "PageSetup",
            "PageNumber",
            "Break",
            "InsertFootnote",
            "InsertEndnote",
            "Separator",
            "Find",
            "Separator",
            "Comments",
            "TrackChanges",
            "Separator",
            "LocalClipboard",
            "RestrictEditing",
            "Separator",
            "FormFields",
            "UpdateFields",
        ];

       
        return baseItems;
    }, []);

    if (!docId || state.error) {
        return (
            <div className="doc-error">
                <p>Document not found!</p>
            </div>
        );
    }

    let documenteditor = container?.current?.documentEditor


    let items = [
        {
            text: 'Single',
        },
        {
            text: '1.15',
        },
        {
            text: '1.5',
        },
        {
            text: 'Double',
        },
    ];

    let fontStyle = ['Algerian', 'Arial', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Courier New', 'Georgia', 'Impact', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Symbol', 'Times New Roman', 'Verdana', 'Windings'];
    let fontSize = ['8', '9', '10', '11', '12', '14', '16', '18',
        '20', '22', '24', '26', '28', '36', '48', '72', '96'];



    function contentTemplate1() {
        return (<DropDownButtonComponent items={items} iconCss="e-de-ctnr-linespacing  e-icons" select={lineSpacingAction} ></DropDownButtonComponent>);
    }
    function contentTemplate2() {
        return (
            <div>
                <ColorPickerComponent showButtons={true} value='#000000' change={changeFontColor}></ColorPickerComponent>
            </div>
        );

    }
    function contentTemplate3() {
        return (
            <div >
                <ComboBoxComponent dataSource={fontStyle} select={changeFontFamily} index={2} allowCustom={true} showClearButton={false} ></ComboBoxComponent>
            </div>
        );
    }
    function contentTemplate4() {
        return (
            <div>
                <ComboBoxComponent dataSource={fontSize} change={changeFontSize} index={2} allowCustom={true} showClearButton={false} ></ComboBoxComponent>
            </div>
        );
    }

    function componentDidMount() {
        if (!documenteditor) {
            return;
        }
        else {
            documenteditor.selectionChange = () => {
                setTimeout(() => { onSelectionChange(); }, 20);
            };
        }

    }

    //To change the font Style of selected content
    function changeFontFamily(args) {
        documenteditor.selection.characterFormat.fontFamily = args.value;
        documenteditor.focusIn();
    }
    //To Change the font Size of selected content
    function changeFontSize(args) {
        documenteditor.selection.characterFormat.fontSize = args.value;
        documenteditor.focusIn();
    }
    //To Change the font Color of selected content
    function changeFontColor(args) {
        if (!documenteditor) {
            return;
        }
        else {
            documenteditor.selection.characterFormat.fontColor = args.currentValue.hex;
            documenteditor.focusIn();
        }

    }

    //Selection change to retrieve formatting
    function onSelectionChange() {
        if (documenteditor.selection) {
            enableDisableFontOptions();
            // #endregion
        }
    }
    function enableDisableFontOptions() {
        var characterformat = documenteditor.selection.characterFormat;
        var properties = [characterformat.bold, characterformat.italic, characterformat.underline, characterformat.strikethrough];
        var toggleBtnId = ["bold", "italic", "underline", "strikethrough"];
        for (let i = 0; i < properties.length; i++) {
            changeActiveState(properties[i], toggleBtnId[i]);
        }
    }
    function changeActiveState(property, btnId) {
        let toggleBtn = document.getElementById(btnId);
        if ((typeof (property) == 'boolean' && property == true) || (typeof (property) == 'string' && property !== 'None'))
            toggleBtn.classList.add("e-btn-toggle");
        else {
            if (toggleBtn.classList.contains("e-btn-toggle"))
                toggleBtn.classList.remove("e-btn-toggle");
        }
    }




    function toolbarButtonClick(arg) {
        switch (arg.item.id) {
            case 'AlignLeft':
                //Toggle the Left alignment for selected or current paragraph
                documenteditor.editor.toggleTextAlignment('Left');
                break;
            case 'AlignRight':
                //Toggle the Right alignment for selected or current paragraph
                documenteditor.editor.toggleTextAlignment('Right');
                break;
            case 'AlignCenter':
                //Toggle the Center alignment for selected or current paragraph
                documenteditor.editor.toggleTextAlignment('Center');
                break;
            case 'Justify':
                //Toggle the Justify alignment for selected or current paragraph
                documenteditor.editor.toggleTextAlignment('Justify');
                break;
            case 'IncreaseIndent':
                //Increase the left indent of selected or current paragraph
                documenteditor.editor.increaseIndent();
                break;
            case 'DecreaseIndent':
                //Decrease the left indent of selected or current paragraph
                documenteditor.editor.decreaseIndent();
                break;
            case 'ClearFormat':
                documenteditor.editor.clearFormatting();
                break;
            case 'ShowParagraphMark':
                //Show or hide the hidden characters like spaces, tab, paragraph marks, and breaks.
                documenteditor.documentEditorSettings.showHiddenMarks = !documenteditor.documentEditorSettings.showHiddenMarks;
                break;
            case 'bold':
                //Toggles the bold of selected content
                documenteditor.editor.toggleBold();
                break;
            case 'italic':
                //Toggles the Italic of selected content
                documenteditor.editor.toggleItalic();
                break;
            case 'underline':
                //Toggles the underline of selected content
                documenteditor.editor.toggleUnderline('Single');
                break;
            case 'strikethrough':
                //Toggles the strikethrough of selected content
                documenteditor.editor.toggleStrikethrough();
                break;
            case 'subscript':
                //Toggles the subscript of selected content
                documenteditor.editor.toggleSubscript();
                break;
            case 'superscript':
                //Toggles the superscript of selected content
                documenteditor.editor.toggleSuperscript();
                break;
        }
    }
    //Change the line spacing of selected or current paragraph
    function lineSpacingAction(args) {
        let text = args.item.text;
        switch (text) {
            case 'Single':
                documenteditor.selection.paragraphFormat.lineSpacing = 1;
                break;
            case '1.15':
                documenteditor.selection.paragraphFormat.lineSpacing = 1.15;
                break;
            case '1.5':
                documenteditor.selection.paragraphFormat.lineSpacing = 1.5;
                break;
            case 'Double':
                documenteditor.selection.paragraphFormat.lineSpacing = 2;
                break;
        }
        setTimeout(() => {
            documenteditor.focusIn();
        }, 30);
    }
    // Selection change to retrieve formatting
    function onSelectionChange() {
        if (documenteditor.selection) {
            var paragraphFormat = documenteditor.selection.paragraphFormat;
            var toggleBtnId = ['AlignLeft', 'AlignCenter', 'AlignRight', 'Justify', 'ShowParagraphMark'];
            //Remove toggle state.
            for (var i = 0; i < toggleBtnId.length; i++) {
                let toggleBtn = document.getElementById(toggleBtnId[i]);
                toggleBtn.classList.remove('e-btn-toggle');
            }
            //Add toggle state based on selection paragraph format.
            if (paragraphFormat.textAlignment === 'Left') {
                document.getElementById('AlignLeft').classList.add('e-btn-toggle');
            } else if (paragraphFormat.textAlignment === 'Right') {
                document.getElementById('AlignRight').classList.add('e-btn-toggle');
            } else if (paragraphFormat.textAlignment === 'Center') {
                document.getElementById('AlignCenter').classList.add('e-btn-toggle');
            } else {
                document.getElementById('Justify').classList.add('e-btn-toggle');
            }
            if (documenteditor.documentEditorSettings.showHiddenMarks) {
                document.getElementById('ShowParagraphMark').classList.add('e-btn-toggle');
            }
            // #endregion
        }
    }


    return (
        <>

            <div className="row  w-100 m-t-5">
                <div className="col-sm-10"
                    style={{
                        opacity: state.loading ? 0 : 1,
                        pointerEvents: state.loading ? "none" : "auto",
                        minWidth: "1200px",
                    }}
                >
                    <>


                        <ToolbarComponent id='toolbar' clicked={toolbarButtonClick}>
                            <ItemsDirective>
                                <ItemDirective id="AlignLeft" key="AlignLeft" prefixIcon="e-de-ctnr-alignleft e-icons" tooltipText="Align Left" />
                                <ItemDirective id="AlignCenter" key="AlignCenter" prefixIcon="e-de-ctnr-aligncenter e-icons" tooltipText="Align Center" />
                                <ItemDirective id="AlignRight" key="AlignRight" prefixIcon="e-de-ctnr-alignright e-icons" tooltipText="Align Right" />
                                <ItemDirective id="Justify" key="Justify" prefixIcon="e-de-ctnr-justify e-icons" tooltipText="Justify" />
                                <ItemDirective type="Separator" key="Separator1" />
                                <ItemDirective id="IncreaseIndent" key="IncreaseIndent" prefixIcon="e-de-ctnr-increaseindent e-icons" tooltipText="Increase Indent" />
                                <ItemDirective id="DecreaseIndent" key="DecreaseIndent" prefixIcon="e-de-ctnr-decreaseindent e-icons" tooltipText="Decrease Indent" />
                                <ItemDirective type="Separator" key="Separator2" />
                                <ItemDirective id="LineSpacing" key="LineSpacing" template={contentTemplate1} />
                                <ItemDirective id="ClearFormat" key="ClearFormat" prefixIcon="e-de-ctnr-clearall e-icons" tooltipText="Clear Formatting" />
                                <ItemDirective type="Separator" key="Separator3" />
                                <ItemDirective id="ShowParagraphMark" key="ShowParagraphMark" prefixIcon="e-de-e-paragraph-mark e-icons" tooltipText="Show the hidden characters like spaces, tab, paragraph marks, and breaks.(Ctrl + *)" />

                                <ItemDirective id="bold" key="bold" prefixIcon="e-de-ctnr-bold" tooltipText="Bold" />
                                <ItemDirective id="italic" key="italic" prefixIcon="e-de-ctnr-italic" tooltipText="Italic" />
                                <ItemDirective id="underline" key="underline" prefixIcon="e-de-ctnr-underline" tooltipText="Underline" />
                                <ItemDirective id="strikethrough" key="strikethrough" prefixIcon="e-de-ctnr-strikethrough" tooltipText="Strikethrough" />
                                <ItemDirective id="subscript" key="subscript" prefixIcon="e-de-ctnr-subscript" tooltipText="Subscript" />
                                <ItemDirective id="superscript" key="superscript" prefixIcon="e-de-ctnr-superscript" tooltipText="Superscript" />
                                <ItemDirective type="Separator" key="Separator4" />
                                <ItemDirective id="FontColor" key="FontColor" template={contentTemplate2} />
                                <ItemDirective type="Separator" key="Separator5" />
                                <ItemDirective id="FontFamily" key="FontFamily" template={contentTemplate3} />
                                <ItemDirective id="FontSize" key="FontSize" template={contentTemplate4} />
                            </ItemsDirective>




                        </ToolbarComponent>


                        <DocumentEditorContainerComponent
                            id="container"
                            height="100vh"
                            ref={container}
                            serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/documenteditor/"
                            toolbarItems={toolbarItems}
                            enableToolbar={true}
                            enablePropertiesPane={true} // Enable the property pane
                            style={{
                                minWidth: "1200px",
                            }}
                            showPropertiesPane={false}
                            onContentChange={autoSaveContent}

                        />

                    </>
                </div>

                <div className="col-sm-2" style={{ height: "100vh", overflowY: "auto" }}>
                    <div className="row">
                        <div className="col-sm-12">
                            {controls ? (controls) : (controls)}
                        </div>
                    </div>

                    {type === "LetterTemplate" ? (
                        <>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control col"
                                            value={renameDoc}
                                            onChange={(e) =>
                                                setRenameDoc(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="d-flex">
                                        <button
                                            type="button"
                                            className="btn btn-primary font-weight-bold ml-auto m-t-5 m-b-5"
                                            onClick={renameDocFileName}
                                        >
                                            Rename
                                        </button>
                                    </div>
                                </div>
                            </div>



                            <div className="row">
                                <div className="col-sm-12">
                                    {isPropertyPaneReady && (
                                        <Select
                                            options={dropdownPages}
                                            className="w-100"
                                            onChange={handlePageChange}
                                            value={selectedPageOption}
                                            placeholder="Select a Page"
                                            styles={{
                                                container: (base) => ({
                                                    ...base,
                                                    width: '100%'
                                                }),
                                            }} />
                                    )}
                                </div>
                            </div>
                            <div className="row mt-4">
                                {/* Column 1 (Odd-indexed items) */}
                                <div className="col-sm-6 text-center">
                                    <div className="icon-text-boxes">
                                        {dropdownVariables?.filter((_, index) => index % 2 === 0).map((variable, index) => (
                                            variable.button_name ? (
                                                <div
                                                    key={index}
                                                    className="text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer m-t-5"
                                                    id="no-vertical-border"
                                                    onClick={() => handleVariableChange(`{{${variable.name}}}`)}
                                                >
                                                    <p className="name">
                                                        {variable.button_name}
                                                    </p>
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                </div>

                                {/* Column 2 (Even-indexed items) */}
                                <div className="col-sm-6 text-center">
                                    <div className="icon-text-boxes">
                                        {dropdownVariables?.filter((_, index) => index % 2 !== 0).map((variable, index) => (
                                            variable.button_name ? (
                                                <div
                                                    key={index + dropdownVariables.length}  // Unique key for second column
                                                    className="text-center height-25 btn-primary-lighter-2 font-weight-semibold btn-white-hover cursor-pointer m-t-5"
                                                    id="no-vertical-border"
                                                    onClick={() => handleVariableChange(`{{${variable.name}}}`)}
                                                >
                                                    <p className="name">
                                                        {variable.button_name}
                                                    </p>
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (null)}



                </div>
            </div>





        </>
    );
}

export default WPBase;
