
function dataURItoBinArray( data ) {
    // taken from: https://stackoverflow.com/a/11954337/14699733
    var binary = atob( data );
    var array = [];
    for ( var i = 0; i < binary.length; i++ ) {
        array.push( binary.charCodeAt( i ) );
    }
    return new Uint8Array( array );
}
$(document).click(function(){
    $(".dropdown-menu").removeClass("show");

});
/** Function to load a PDF file using the input=file API */
// document.querySelector( "#opendoc" ).addEventListener( "change", function ( e ) {
//     let file = e.target;
//     let reader = new FileReader();
//     reader.onload = async function () {
//         await pdfViewer.loadDocument( {
//             data: dataURItoBinArray( reader.result.replace( /^data:.*;base64,/, "" ) )
//         } );
//         await pdfThumbnails.loadDocument( {
//             data: dataURItoBinArray( reader.result.replace( /^data:.*;base64,/, "" ) )
//         } ).then( () => pdfThumbnails.setZoom( "fit" ) );
//     }
//     if ( file.files.length > 0 ) {
//         reader.readAsDataURL( file.files[ 0 ] );
//         document.querySelector( '#filedownload' ).download = document.querySelector( '#opendoc' ).files[
//             0 ].name;
//     }
// } );
/** Sets the document in horizontal scroll by changing the class for the pages container and refreshing the document
 *    so that the pages may be displayed in horizontal scroll if they were not visible before */
function setHorizontal() {
    document.querySelector( ".maindoc" ).classList.add( "horizontal-scroll" );
    pdfViewer.refreshAll();
}
/** Toggles the visibility of the thumbnails */
function togglethumbs( el ) {
    if ( el.classList.contains( 'pushed' ) ) {
        el.classList.remove( 'pushed' );
        document.querySelector( '.thumbnails' ).classList.add( 'hide' );
    } else {
        el.classList.add( 'pushed' );
        document.querySelector( '.thumbnails' ).classList.remove( 'hide' );
    }
}
/** Now create the PDFjsViewer object in the DIV */


let pdfViewer = new PDFjsViewer( $( '.maindoc' ), {
    zoomValues: [ 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4 ],

    /** Update the zoom value in the toolbar */
    onZoomChange: function ( zoom ) {
        zoom = parseInt( zoom * 10000 ) / 100;
        $( '.zoomval' ).text( zoom + '%' );
    },

    /** Update the active page */
    onActivePageChanged: function ( page ) {
        let pageno = $( page ).data( 'page' );
        let pagetotal = this.getPageCount();

        pdfThumbnails.setActivePage( pageno );
        $( '#pageno' ).val( pageno );
        $( '#pageno' ).attr( 'max', pagetotal );
        $( '#pagecount' ).text( 'Page ' + pagetotal );
    },

    /** zoom to fit when the document is loaded and create the object if wanted to be downloaded */
    onDocumentReady: function () {
        pdfViewer.setZoom( 'fit' );
        // pdfViewer.pdf.getData().then( function ( data ) {
        //     document.querySelector( '#filedownload' ).href = URL.createObjectURL( new Blob(
        //         [ data ], {
        //             type: 'application/pdf'
        //         } ) );
        //     document.querySelector( '#filedownload' ).target = '_blank';
        // } );
    }
} );

/** Load the initial PDF file */
// pdfViewer.loadDocument( PDFFILE ).then( function () {
//     // document.querySelector( '#filedownload' ).download = PDFFILE;
// } );

/** Create the thumbnails */
let pdfThumbnails = new PDFjsViewer( $( '.thumbnails' ), {
    zoomFillArea: 0.7,
    onNewPage: function ( page ) {
        page.on( 'click', function () {
            if ( !pdfViewer.isPageVisible( page.data( 'page' ) ) ) {
                pdfViewer.scrollToPage( page.data( 'page' ) );
            }
        } )
    },
    onDocumentReady: function () {
        this.setZoom( 'fit' );
    }
} );

pdfThumbnails.setActivePage = function ( pageno ) {
    this.$container.find( '.pdfpage' ).removeClass( 'selected' );
    let $npage = this.$container.find( '.pdfpage[data-page="' + pageno + '"]' ).addClass( 'selected' );
    if ( !this.isPageVisible( pageno ) ) {
        this.scrollToPage( pageno );
    }
}.bind( pdfThumbnails );

// pdfThumbnails.loadDocument( PDFFILE );





function removeButton(doc_id){

    $.ajax( {
        url: "BP/remove_doc_button/",
        type: "POST",
        data: {
            "doc_id": doc_id,
                csrfmiddlewaretoken: '{{ csrf_token }}'

        },
        success: function ( res ) {
            $('#documentPreviewModal').modal( 'hide' );

            // location.href = "{% url 'bp-documents' client.id case.id %}";

        },

        // Error handling
        error: function ( error ) {
            console.log( `Error ${error}` );
        }

    } );


}


function docPreview(doc_id,doc_upload){
    $("#search-doc").attr("onkeyup",`searchClient(this,${doc_id})`)
    // pdfViewer = pdfViewer2(doc_upload);

    $.ajax( {
        url: "/30/ListDoc/",
        type: "GET",
        data: {
            "doc_id": doc_id,
            csrfmiddlewaretoken: '{{ csrf_token }}'

        },
        success: function ( res ) {
            console.log(res);
            data  = res["data"];

            docToDo = res["docToDo"];
            doc_upload = data["upload"]
            pdfViewer.loadDocument( doc_upload )
            pdfThumbnails.loadDocument( doc_upload );
            page_data = res["page"];
            pageInfo = ''
            if (page_data != ""){
                pageInfo =  `<img src="${(page_data["page_icon"]  === null) ? "": page_data["page_icon"]}" width="20" alt="">
                            <p class="ml-1">${data["page_name"]}</p>`
            }
            else{
                pageInfo = '';

            }

            case_id = data["for_case"]["id"];


            todo = res["ToDo"];
            var html = '';

            for(i = 0; i < todo.length; i++) {

                if(docToDo.includes(todo[i]["id"])){
                 html = html + `<li style="background-color:#777777" onclick="selectToDo(${todo[i]["id"]},'${todo[i]["notes"].slice(0,30)} ....')">${todo[i]["notes"].slice(0,30)} ....</li>`
                }
                else{
                    html = html + `<li onclick="selectToDo(${todo[i]["id"]},'${todo[i]["notes"].slice(0,30)} ....')">${todo[i]["notes"].slice(0,30)} ....</li>`

                }
                                }

            var panels = (res["panel_name"] === null )? "":res["panel_name"];


            if (data["document_slot"] != null){
            slp = `${data["document_slot"]["slot_number"]}. ${(data["document_slot"]["slot_name"] === null)? "Available" : data["document_slot"]["slot_name"] } `
            }
            else{
                slp = "";
            }




            $("#docData").html(`

            <div class="top-content">
                    <span class="client-name">
                        <a class="clientTabFont d-block" href="#"> ${data["for_client"]["last_name"]}<span>,</span>
                            ${data["for_client"]["first_name"]}
                        </a>
                    </span>
                    <div class="basic-info mb-2">
                        <div class="tile-row d-flex flex-wrap w-100 mb-4">
                            <span class="text-lightgray">Case type</span>
                            <span class="text-black ml-auto">${data["for_case"]["case_type"]["name"]}</span>
                        </div>

                        <div class="tile-row d-flex flex-wrap w-100">
                            <span class="text-lightgray">Doc Name</span>
                            <span class="text-black ml-auto">${data["file_name"]}</span>
                        </div>
                        <div class="tile-row d-flex flex-wrap w-100">
                            <span class="text-lightgray">Upload</span>
                            <span class="text-black ml-auto">${data["docDate"]}</span>
                        </div>

                        <div class="tile-row d-flex align-items-center flex-wrap w-100 mt-3">
                            ${pageInfo}
                        </div>
                        <div class="tile-row d-flex flex-wrap w-100">
                            <p class="ml-4">${panels} </p>
                        </div>
                        <div class="tile-row d-flex flex-wrap w-100">
                            <p style=" margin-left:2.5rem !important;">${slp}</p>
                        </div>
                    </div>


                </div>
                <div class="center-content my-auto">


                    <div class="tile-row w-100 mb-3">


                        <div  class="dropdown mb-2">


                                    <button  class='btn letter-template-bckgrnd dropdown-toggle d-block w-100 form-select btn-${doc_id}-${case_id}' onclick='showDrop(this,event,${doc_id},${case_id})' type='button' >Select Page <span class='caret'></span></button><div class='dropdown d-${doc_id}-${case_id}'>   <ul class='dropdown-menu add-menu d2-${doc_id}-${case_id}' >{% for page in pages %}<li  class='dropdown-submenu'><a  onclick = 'getDataDoc({{page.id}},this,event,${doc_id},${case_id},{{forloop.counter}},"{{page.name}}")'  class='test trigger right-caret' tabindex='-1'  href='#'><img src='{{page.page_icon.url}}' style="width: 15px; height: 15px;" class='mr-1'>{{page.name}} <span class='caret'></span></a><ul class='dropdown-menu ul2-{{forloop.counter}}-{{page.id}} submenu' ></ul></li>{% endfor %}<li  class='dropdown-submenu'><a  onclick = 'postDoc("","",${doc_id},"", "False" ,${case_id},"No Page","","");event.stopPropagation();' tabindex='-1'  href='#'><i class='icon-file-text mr-1'></i>Sort Later</a></li> </ul></div>
                                    <input hidden id="${doc_id}-${case_id}-slot"/>
                                    <input hidden id="${doc_id}-${case_id}-panel"/>
                                    <input hidden id="${doc_id}-${case_id}-page"/>

                            </div>

                            <br>

                        <div class="dropdown mb-2">
                            <button class="btn letter-template-bckgrnd dropdown-toggle d-block w-100 form-select" type="button"
                                id="dropdownFirmUser" data-toggle="dropdown" aria-haspopup="true"
                                aria-expanded="false">
                                Select Firm User
                            </button>
                            <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton" id="doc_firm_user">
                                <ul class="nav list-hover">
                                    <input hidden id="thread_id" value="">
                                    <input hidden id="user_name" value="">
                                    <input hidden id="profile_pic" value="">


                                    <input id="selected_firm_user_id" value="" hidden>


                                    {% for thread in Threads %}
                                    {% if thread.second_person.bp_attorneystaff_userprofile.profile_pic %}
                                    <li onclick="selectFirmUser({{thread.second_person.id}},{{thread.id}},'{{thread.second_person.first_name}}','{{thread.second_person.last_name}}','{{thread.second_person.bp_attorneystaff_userprofile.profile_pic.url}}')"><span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img"><img src={{thread.second_person.bp_attorneystaff_userprofile.profile_pic.url}} alt=""></span> {{thread.second_person.first_name}} {{ thread.second_person.last_name }}</li>
                                    {% else %}
                                    <li onclick="selectFirmUser({{thread.second_person.id}},{{thread.id}},'{{thread.second_person.first_name}}','{{thread.second_person.last_name}}','None')"> <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img"></span> {{thread.second_person.first_name}} {{ thread.second_person.last_name }}</li>
                                    {% endif %}

                                    {% endfor %}
                                </ul>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary d-block w-100 text-white disabled" onclick="submitFirmUser(${doc_id},'${doc_upload}','${data["file_name"]}')">Chat Document</button>
                    </div>


                    <div class="dropdown mb-2">
                        <button class="btn letter-template-bckgrnd dropdown-toggle d-block w-100 form-select" type="button"
                            id="dropdownToDo" data-toggle="dropdown" aria-haspopup="true"
                            aria-expanded="false">
                            Select To-Do
                        </button>
                        <input id="selected_todo_id" value="" hidden>

                        <div class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton" id="doc_todo">
                            <ul class="nav list-hover">
                                ${html}
                                <li onclick="addNewToDo()">Add New ToDo</li>

                            </ul>
                        </div>
                    </div>
                    <button type="button" class="btn btn-primary d-block w-100 text-white disabled" onclick="submitToDo(${doc_id})">Link To-Do</button>
                </div>
                <div class="bottom-content">
                    <a href="/30/download_doc_pdf/${doc_id}" class="btn btn-primary d-block w-100 download-btn">Download Document</a>
                    <button type="button" onclick="removeButton(${doc_id})" class="btn btn-secondary d-block w-100 mb-2">Remove Document</button>
                    <button type="button" onclick="deleteButton(${doc_id})" class="btn btn-secondary d-block w-100 mb-2">Delete Document</button>
                </div>`)



            $('#documentPreviewModal').modal( 'show' );
            // location.href = "{% url 'bp-documents' client.id case.id %}";

        },

        // Error handling
        error: function ( error ) {
            console.log( `Error ${error}` );
        }
    } );




}

function selectFirmUser(user_id,thread_id,first_name,last_name,profile_pic){
    if (profile_pic == "None"){
        profile_pic = "{% static 'img/avatar.png' %}"

    }
    $("#dropdownFirmUser").html(`<span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img"><img src="${profile_pic}" alt=""></span>${first_name} ${last_name}`)


    $("#doc_firm_user").toggleClass("show");
    $("#selected_firm_user_id").val(user_id);
    $("#thread_id").val(thread_id);
    $("#profile_pic").val(profile_pic);
    $("#user_name").val(capitalizeName(first_name)+" "+capitalizeName(last_name))





}

$(document).click(function(){
$(".dropdown-menu").removeClass("show");

});

function selectToDo(todo_id,notes){
    $("#dropdownToDo").html(`${notes}`)
    $("#doc_todo").toggleClass("show");
    $("#selected_todo_id").val(todo_id);


}




function submitFirmUser(doc_id,doc_link,doc_name){
    var user_id = $("#selected_firm_user_id").val();
    var thread_id = $("#thread_id").val();
    var user_name = $("#user_name").val();
    var profile_pic = $("#profile_pic").val();
if (user_id != ""){
    $("#documentPreviewModal").modal("hide");
    $("#sendMessage").html(`
    <div class="modal-header">
            <input type="hidden" id="logged-in-user" value="">
            <h5 class="modal-title" id="avatarModalTitle">Send a link for this document to <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img"><img src="${profile_pic}" alt=""></span> ${user_name}
                 </h5>
        </div>
        <div class="modal-body">
            <label for="w3review">You can send a chat message below</label>
            <br>
            <label for="w3review">Type Message:</label>
            <textarea type="text" style="border: solid 1px grey; width: 100%; padding: 10px;"
                id="id_chat_message_input" class="chatMessage" name="chatMessage" rows="4" cols="50"></textarea>
        </div>
        <div class="modal-footer" style="padding: 2rem;">
            <button type="button"
            onclick="sendMessage(event,this,'${doc_link}','${doc_name}')"

                class="btn btn-success sendChatMessage input-group-text send_btn" style="position: absolute; right: 14px;
            background-color: #218838;
            color: white;
            border-color: #218838;"
                data-name="${user_name}"
                data-sendMessage="" data-staffID="${user_id}"
                data-threadID="${thread_id}" data-docID="${doc_id}" >Send Document Link</button>
            <button type="button" class="btn btn-danger"
                style="background-color: grey; border-color:grey; position: absolute; left: 14px;"
                data-dismiss="modal">Close</button>
        </div>

    `)


    $("#firmuser-modal").modal("show");
    }
}




function submitToDo(doc_id){
    var todo_id = $("#selected_todo_id").val();
    // alert(doc_id);
    // alert(todo_id);



$.ajax({
url: "/30/todo_with_doc/",
type:"POST",
data: {
"todo_id":todo_id,
"doc_id":doc_id,
csrfmiddlewaretoken: '{{ csrf_token }}'


},
success: function (res) {
console.log(res);
// $("#documentPreviewModal").modal("hide");
localStorage.setItem("docId", doc_id);
window.location.reload();

},



// Error handling
error: function (error) {
console.log(`Error ${error}`);
}
});


}



function addNewToDo(){
    var todo_id= $("#selected_todo_id").val();

    $("#documentPreviewModal").modal("hide");
    $("#addnewtodo-modal").modal("show");
}



function deleteButton(doc_id){
location.href = `/30/delete_doc_pdf/${doc_id}`
$("#documentPreviewModal").modal("hide");

}

function showDrop(elem,e,doc_id,case_id){
e.stopPropagation();
e.preventDefault();
$(".submenu").css({"display":"none"});
$(".dropdown-menu").removeClass("show");
$(`.d-${doc_id}-${case_id}`).toggleClass("show");
$(`.d2-${doc_id}-${case_id}`).toggleClass("show");




}


function getDataDoc(page_id,elem,e,doc_id,case_id,i,page_name){
e.stopPropagation();
e.preventDefault();
$(".submenu").css({"display":"none"});


$.ajax({
url: "/30/ListPagePanels/",
type: "GET",
data: {
"page_id": page_id,
"case_id": case_id,
},
success: function (res) {
console.log(res);
var discovery_slot = "";
data = res["data"];
var html9 = `<li><a onclick="postDocPopUp(${page_id},'-1',${doc_id},'','False',${case_id},'${page_name}','','');event.stopPropagation();" style="width:90%" href="#">Attach to ${page_name}</a></li>`
var html = ''

if(page_name == 'Discovery'){

doc_slots = res["document_slots"];



if (doc_slots.length > 0){
for (let i = 0; i < doc_slots.length; i++) {
    if(doc_slots[i]["slot_number"] == 1){
discovery_slot = doc_slots[i]["id"];
}}}



if (data.length > 0){
$(elem).next('ul').toggle();

for (let j = 0; j < data.length; j++) {


if (doc_slots.length > 0){
for (let i = 0; i < doc_slots.length; i++) {
    if(doc_slots[i]["slot_number"] == 1)


{
html= html + `<li><a onclick="postDocPopUp(${page_id},${data[j]["id"]},${doc_id},${doc_slots[i]["id"]},'True',${case_id},'${page_name}','Special Interrogatories to ${data[j]["to_data"]["first_name"]} ${data[j]["to_data"]["last_name"]} from ${data[j]["from_data"]["first_name"]} ${data[j]["from_data"]["last_name"]}','${doc_slots[i]["slot_name"]}');event.stopPropagation();" style="width:90%" href="#">Special Interrogatories to ${data[j]["to_data"]["first_name"]} ${data[j]["to_data"]["last_name"]} from ${data[j]["from_data"]["first_name"]} ${data[j]["from_data"]["last_name"]}, ${doc_slots[i]["slot_name"]}</a></li>`;
}

else{
    html9 = `<li><a onclick="postDocPopUp(${page_id},'-1',${doc_id},${doc_slots[i]["id"]},'False',${case_id},'${page_name}','','${doc_slots[i]["slot_name"]}');event.stopPropagation();" style="width:90%" href="#">Attach to ${page_name}</a></li>`
}
}
}
else{
html= html + `<li><a onclick="postDocPopUp(${page_id},${data[j]["id"]},${doc_id},'','True',${case_id},'${page_name}','Special Interrogatories to ${data[j]["to_data"]["first_name"]} ${data[j]["to_data"]["last_name"]} from ${data[j]["from_data"]["first_name"]} ${data[j]["from_data"]["last_name"]}','');event.stopPropagation();" style="width:90%" href="#">Special Interrogatories to ${data[j]["to_data"]["first_name"]} ${data[j]["to_data"]["last_name"]} from ${data[j]["from_data"]["first_name"]} ${data[j]["from_data"]["last_name"]}</a></li>`;
}


}

}

else{
$(elem).next('ul').toggle();
doc_slots = res["document_slots"];
for (let i = 0; i < doc_slots.length; i++) {
if(doc_slots[i]["slot_number"] == 0){

html9 = `<li><a onclick="postDocPopUp(${page_id},'-1',${doc_id},${doc_slots[i]["id"]},'False',${case_id},'${page_name}','','');event.stopPropagation();" style="width:90%" href="#">Attach to ${page_name}</a></li>`


}
else{
html9 = `<li><a onclick="postDocPopUp(${page_id},'-1',${doc_id},'','False',${case_id},'${page_name}','','');event.stopPropagation();" style="width:90%" href="#">Attach to ${page_name}</a></li>`


}


}


// $(`#ul2-${i}-${page_id}`).remove();
// postDocPopUp(page_id,"",doc_id,"","False",case_id);
// $(".dropdown-menu").removeClass("show");
// $(".submenu").css({"display":"none"});


}



}
else{
if (data.length > 0){

$(elem).next('ul').toggle();
doc_slots = res["document_slots"];

for (let j = 0; j < data.length; j++) {

    if (doc_slots.length > 0){
        for (let i = 0; i < doc_slots.length; i++) {
            if(doc_slots[i]["slot_number"] != 0)
{

var nm = "";
if(doc_slots[i]["slot_name"] == null || doc_slots[i]["slot_name"] == "" ){
nm = `Available, ${doc_slots[i]["slot_number"] } `
}
else{
nm = doc_slots[i]["slot_name"];
}

        html= html + `<li><a onclick="postDocPopUp(${page_id},${data[j]["id"]},${doc_id},${doc_slots[i]["id"]},'True',${case_id},'${page_name}','${data[j]["panel_name"]}','${nm}');event.stopPropagation();" style="width:90%" href="#">${data[j]["panel_name"]} , ${nm}</a></li>`;
        }

        else{
            html9 = `<li><a onclick="postDocPopUp(${page_id},'-1',${doc_id},${doc_slots[i]["id"]},'False',${case_id},'${page_name}','','${doc_slots[i]["slot_name"]}');event.stopPropagation();" style="width:90%" href="#">Attach to ${page_name}</a></li>`
        }
    }
    }
    else{
        html= html + `<li><a onclick="postDocPopUp(${page_id},${data[j]["id"]},${doc_id},'','True',${case_id},'${page_name}','${data[j]["panel_name"]}','');event.stopPropagation();" style="width:90%" href="#">${data[j]["panel_name"]} </a></li>`;
    }


}

}

else{
$(elem).next('ul').toggle();
doc_slots = res["document_slots"];
for (let i = 0; i < doc_slots.length; i++) {
if(doc_slots[i]["slot_number"] == 0){

    html9 = `<li><a onclick="postDocPopUp(${page_id},'-1',${doc_id},${doc_slots[i]["id"]},'False',${case_id},'${page_name}','','');event.stopPropagation();" style="width:90%" href="#">Attach to ${page_name}</a></li>`


}
else{
    html9 = `<li><a onclick="postDocPopUp(${page_id},'-1',${doc_id},'','False',${case_id},'${page_name}','','');event.stopPropagation();" style="width:90%" href="#">Attach to ${page_name}</a></li>`


}


}


// $(`#ul2-${i}-${page_id}`).remove();
// postDoc(page_id,"",doc_id,"","False",case_id);
// $(".dropdown-menu").removeClass("show");
// $(".submenu").css({"display":"none"});


}

}


if(page_name == 'Discovery'){
$(`.ul2-${i}-${page_id}`).html(html+html9+`<li><a href='#' onclick='showDiscoveryPopUP(${case_id},${doc_id},${discovery_slot},event)' >Create a New Discovery</a></li>`);


}
else{
$(`.ul2-${i}-${page_id}`).html(html+html9);
}

// if (data.length > 0){
// $(`.ul2-${i}-${page_id}`).html(html+html9);
// }
// else{
//     $(`.ul2-${i}-${page_id}`).html(html);

// }
},



// Error handling
error: function (error) {
console.log(`Error ${error}`);
}
});
}



function showDiscoveryPopUP(case_id,doc_id,slot_id,e){
e.stopPropagation();
e.preventDefault();
$(".dropdown-menu").removeClass("show");
$(".submenu").css({"display":"none"});


$.ajax({
url: "/30/GetUtilsForDiscovery",
type:"GET",
data: {
"case_id": case_id,
csrfmiddlewaretoken: '{{ csrf_token }}'


},
success: function (res) {
console.log(res);

var html = '';
var def = res["data"]["defendant_records"];
var other = res["data"]["other_party_records"];
var client = res["data"]["client_records"];
var lit = res["data"]["litigation_records"];
var lit_ev = res["data"]["litigation_event_records"];






var selOpts = "";
    for (i=0;i<def.length;i++)
    {
        var id = `Defendant, ${def[i]['id']}`;
        var val = `${def[i]['first_name']} ${def[i]['last_name']} (Defendant)`;
        selOpts += "<option value='"+id+"'>"+val+"</option>";
    }
    for (i=0;i<client.length;i++)
    {
        var id = `Client, ${client[i]['id']}`;
        var val = `${client[i]['first_name']} ${client[i]['last_name']} (Client)`;
        selOpts += "<option value='"+id+"'>"+val+"</option>";
    }
    for (i=0;i<other.length;i++)
    {
        var id = `Parties, ${other[i]['id']}`;
        var val = `${other[i]['party_first_name']} ${other[i]['party_last_name']} (Other Party)`;
        selOpts += "<option value='"+id+"'>"+val+"</option>";
    }







    var dis = '';
    for (i=0;i<lit_ev.length;i++)
    {
        console.log(lit_ev[i]["event_type_id"]["litigation_event_type"]);
    if(lit_ev[i]["event_type_id"]["litigation_event_type"] == 'Discovery'){
            console.log(lit_ev[i]["state_id"],lit_ev[i]["county_id"]);
            console.log(lit["state"],lit["county"]);

    if(lit_ev[i]["state_id"] && lit_ev[i]["county_id"]){
        console.log("1")

        if((lit_ev[i]["state_id"] == lit["state"]) && (lit_ev[i]["county_id"] == lit["county"])){
            console.log("1")

                var id = lit_ev[i]['id'];
                var val = lit_ev[i]['event_name'];
                dis += "<option value='"+id+"'>"+val+"</option>";

            }


    }
    else if(lit_ev[i]["state_id"] && !(lit_ev[i]["county_id"])){
        console.log("2")


                if(lit_ev[i]["state_id"]== lit["state"]){
                var id = lit_ev[i]['id'];
                var val = lit_ev[i]['event_name'];
                dis += "<option value='"+id+"'>"+val+"</option>";

            }


    }

    else if((!lit_ev[i]["state_id"]) && lit_ev[i]["county_id"]){
        console.log("3")


                if(lit_ev[i]["county_id"] == lit["county"]){
                var id = lit_ev[i]['id'];
                var val = lit_ev[i]['event_name'];
                dis += "<option value='"+id+"'>"+val+"</option>";

            }


    }

    else{
                console.log("4")
                var id = lit_ev[i]['id'];
                var val = lit_ev[i]['event_name'];
                dis += "<option value='"+id+"'>"+val+"</option>";

    }







    }
    }
    console.log(dis);





html = `
<form>
<div class="row ml-2">
    <label class="col-md-3">Answering Party: </label>

<select class="form-select" id="ansParty">
    ${selOpts}

</select>
</div>
<br>
<div class="row ml-2">
    <label class="col-md-3">Requesting Party: </label>


<select class="form-select" id="reqParty">
    ${selOpts}

</select>
</div>
<br>
<div class="row ml-2">
    <label class="col-md-3">Discovery Type: </label>

<select class="form-select" id="litType">
    ${dis}

</select>
</div>
<br>

</form>
<div class="modal-footer">
                       <button type="button" class="btn btn-secondary" style="float:left; margin-right:auto;" data-dismiss="modal">Cancel</button>
                       <button type="button" class="btn btn-success" onclick="attachDiscovery(${case_id},${doc_id},${slot_id})">Add Discovery</button>
</div>
`
$("#addlitigationevent .modal-body").html(html);
$("#documentPreviewModal").modal("hide");

$("#addlitigationevent").modal("show");



},



// Error handling
error: function (error) {
console.log(`Error ${error}`);
}
});



}

function attachDiscovery(case_id,doc_id,slot_id){

$.ajax({
url: "/30/AddDiscoveryRecord/",
type:"POST",
data: {
"case_id":case_id,
"doc_id":doc_id,
"discovery_type":$("#litType").val(),
"to_defendant":$("#ansParty").val(),
"from_defendant":$("#reqParty").val(),
csrfmiddlewaretoken: '{{ csrf_token }}'


},
success: function (res) {
$("#addlitigationevent").modal("hide");
console.log(res)
var panel_id = res["panel_id"]
var page_id = res["page_id"]
var panel_name = `Special Interrogatories to ${res["to"]} from ${res["from"]}`
var page_name = res["page_name"]
var slot_name = res["slot_name"]


$(`#${doc_id}-${case_id}-slot`).val(slot_id);
$(`#${doc_id}-${case_id}-panel`).val(panel_id);
$(`#${doc_id}-${case_id}-page`).val(page_id);

var  val = '';
if (page_name){
val = val + page_name
}
if (panel_name){
val = val + ", " + panel_name
}

if (slot_name){
val = val + ", " + slot_name
}
$(`.btn-${doc_id}-${case_id}`).css({"width":"auto"});

$(`.btn-${doc_id}-${case_id}`).html(val);





},



// Error handling
error: function (error) {
console.log(`Error ${error}`);
}
});


}




function attachCase(case_id,doc_id){






$.ajax({
url: "/30/attach_case_doc_popup/",
type: "POST",
data: {
"case_id": case_id,
"doc_id": doc_id,
csrfmiddlewaretoken: '{{ csrf_token }}'



},
success: function (res) {
case_id = res["case_id"];
client_id = res["client_id"];

if ((case_id != undefined) |   (case_id != undefined)){
localStorage.setItem("docId", doc_id);
location.href = `/30/16/${client_id}/${case_id}`;
}

},
// Error handling
error: function (error) {

console.log(`Error ${error}`);
// window.location.reload();

}
});
}



function postDocPopUp(page_id,panel_id,doc_id,slot,panels,case_id,page_name,panel_name,slot_name){

$(`#${doc_id}-${case_id}-slot`).val(slot);
$(`#${doc_id}-${case_id}-panel`).val(panel_id);
$(`#${doc_id}-${case_id}-page`).val(page_id);


console.log("slot",slot);
console.log("panel",panel_id);

$(".dropdown-menu").removeClass("show");
$(".submenu").css({"display":"none"});
// var  val = '';
// if (page_name){
//     val = val + page_name
// }
// if (panel_name){
//     val = val + ", " + panel_name
// }

// if (slot_name){
//     val = val + ", " + slot_name
// }
// $(`.btn-${doc_id}-${case_id}`).css({"width":"auto"});

// $(`.btn-${doc_id}-${case_id}`).html(val);




$.ajax({
url: "/30/'AttachDocToPage/",
type:"POST",
data: {
"page_id": page_id,
"case_id": case_id,
"panel_id":panel_id,
"doc_id":doc_id,
"slot":slot,
"panels": panels,
csrfmiddlewaretoken: '{{ csrf_token }}'


},
success: function (res) {
console.log(res);
localStorage.setItem("docId", doc_id);

location.href = "{% url 'bp-documents' client.id case.id %}";


},



// Error handling
error: function (error) {
console.log(`Error ${error}`);
}
});
}



function searchClient(elem,doc_id) {
       var query = $(elem).val();
       if (query != ""){
       $.ajax({
        url: "/30/getCaseLoad",
        type: 'GET',
        data: {doc_id:doc_id,q:query}, // added data type
        success: function(res) {
            console.log(res);
            var k = 0;
            if (res.length > 0 ){
                var html = '';
            for(i = 0; i < res.length; i++) {

                html = html + `<tr><td>${res[i]["last_name"]},${res[i]["first_name"]}</td>


                    <td>${res[i]["dob"]}</td><td>${res[i]["case"]}</td><td>${res[i]["doi"]}</td><td style="text-align:center"><button class="btn btn-secondary" onclick="attachCase(${res[i]["case_id"]},${doc_id});event.stopPropagation();" style="visibility: visible !important; c"> Save to Case </button></td></tr>`;
                    k= k+1;

            }

            $("#table-doc").find("tbody").html(html);

        }
        else{
            $("#table-doc").find("tbody").html("");

        }
        }
    });
    }

    else{
        $("#table-doc").find("tbody").html("");

    }



    }

    function capitalizeName(name) {
return name.replace(/\b(\w)/g, s => s.toUpperCase());
}



var ws_scheme = "wss";
let actual_client_id = "{{client.id}}"
let actual_case_id = "{{case.id}}"

var ws_path = ws_scheme + '://' + window.location.host + `/30/32/${actual_client_id}/${actual_case_id}/`;
socket = new WebSocket( ws_path )

socket.onopen = async function ( e ) {
console.log( 'open', e )


}

function sendMessage(e,ent,doc_link,doc_name) {


//  ret = DetailsView.GetProject($(this).attr("#data-id"), OnComplete, OnTimeOut, OnError);
let USER_TO = $( ent ).attr( "data-staffID" );
let THREAD_ID = $( ent ).attr( "data-threadID" );
let USER_BY = "{{ request.user.id }}"
let SENDERNAME = $( ent ).attr( "data-name" );
let CHATMESSAGE = $( "#id_chat_message_input" ).val();
let doc_id = $( ent ).attr( "data-docID" );

console.log( "staffID", USER_TO )
console.log( "ThreeadID", THREAD_ID )
console.log( SENDERNAME )
console.log( doc_link )
console.log(doc_name);

CHATMESSAGE = `${CHATMESSAGE} doc_id ${doc_id}`;
console.log( CHATMESSAGE )

//   console.log(USER_BY)
// let thread_id = get_active_thread_id()

let data = {
    'message': CHATMESSAGE,
    'sent_by': USER_BY,
    'send_to': USER_TO,
    'thread_id': THREAD_ID
}
data = JSON.stringify( data )
console.log(data);
socket.send( data )
localStorage.setItem("docId", doc_id);
window.location.reload();


}


socket.onerror = async function(e){
console.log('error', e)
}

socket.onclose = async function(e){
console.log('close', e)
}




$(document).ready(function(){
doc_id = localStorage.getItem("docId");
if (doc_id != null){
docPreview(doc_id,"");
localStorage.removeItem("docId");


}


});
