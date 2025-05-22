const USER_ID = $('#logged-in-user').val()
var input_message = $(`#input-message`)
var message_body = $('.msg_card_body')
var send_message_form = $('#send-message-form')

var logged_in_user_username =  $("#logged-in-user-user-name").val()
var logged_in_user_profile_pic =  $("#logged-in-user-profile-pic").val()
if(!logged_in_user_profile_pic){
    var logged_in_profile_tag = ""
}
else{
    var logged_in_profile_tag = `<img src="${logged_in_user_profile_pic}">`
}

let loc = window.location
let wsStart = 'ws://'

if(loc.protocol === 'https') {
    wsStart = 'wss://'
}
let endpoint = wsStart + loc.host + loc.pathname


var socket = new WebSocket(endpoint)
console.log("socket",socket)

socket.onopen = async function(e){
    console.log( 'Connection established' )
    send_message_form.on('submit', function (e){
        e.preventDefault()
        let message = input_message.val()
        input_message.val(null);
        let send_to = get_active_other_user_id()
        let thread_id = get_active_thread_id()
        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'thread_id': thread_id,
            'user_name':logged_in_user_username,
            'profile_pic':logged_in_user_profile_pic

        }

        console.log("Sending Data");
        console.log(data)


        data = JSON.stringify(data)

      
        socket.send(data)
        // $(this)[0].reset()
    })
}





socket.onmessage = async function(e){
    console.log("I am in the onMessage!");
    console.log('message', e);
    let data = JSON.parse(e.data)

    console.log("Receiving Data");
    console.log(data)



    let message = data['message']
    let sent_by_id = data['sent_by']
    let thread_id = data['thread_id']
    let profile_pic = data['profile_pic']
    let user_name = data['user_name']

    if(!profile_pic){
        profile_pic = ""
    }
    else{
        profile_pic =`<img src="${profile_pic}">` 
    }

    newMessage(message, sent_by_id, thread_id,profile_pic,user_name)    
}

socket.onerror = async function(e){
    console.log('error', e)
}

socket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id, thread_id,profile_pic,user_name) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = daysOfWeekNames[dayOfWeek];


    const month = today.getMonth() + 1;
    const dayOfMonth = today.getDate().toString().padStart(2, '0');;
    const year = today.getFullYear();
    const formattedDate = `${month}/${dayOfMonth}/${year}`;


    const hours = today.getHours();
    const minutes = today.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = (hours % 12) || 12;
    const formattedHours = twelveHourFormat.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedTime = `${formattedHours}:${formattedMinutes} ${amOrPm}`;



	if ($.trim(message) === '') {
		return false;
	}

    if (message.includes("doc_id") && message.includes("doc_name")) {
let index_id = message.indexOf("doc_id");
let doc_id = message.substring(index_id + 7);
let index_name = message.indexOf("doc_name");
let doc_name = message.substring(index_name + 9, index_id);
message = `${message.substring(0, index_name)} <br> ${doc_name} <a href='#' onclick='docPreview(${doc_id},"")'>Click to view this file</a>`;
}


	let message_element;
	let chat_id = 'chat_' + thread_id
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    var match = message.match(urlRegex);
    console.log('match',match)
	if(sent_by_id == USER_ID){
        if (match){
            
            var link = `<a style="margin-left: 10px !important;" href="${match[0]}" target="_blank">${match[0]}</a>`;
            var originalText = message.replace(urlRegex, '');
            console.log('link',link)
            console.log('originalText',originalText)
            message_element = `
            <div class="d-flex align-items-center justify-content-end m-b-5">
            <span class="msg_time_send text-grey position-static p-r-50"><span class="p-r-5">${dayName}</span><span class="p-r-5">${formattedDate}</span> ${formattedTime}</span>
            <div class="d-flex justify-content-end align-items-center">
                <div class="avatar-wrap  position-relative ic-29">
                    <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                    ${logged_in_profile_tag}
                    </span>
                    <span class="online_icon"></span>
                </div>
                <p class="text-right font-weight-semibold ml-2">${logged_in_user_username}</p>
            </div> <!-- .d-flex -->
        </div> <!-- .d-flex -->

        <div class="text-right mb-4 replied">
            <div class="msg_cotainer_send d-flex justify-content-end">
                ${originalText} ${link}
            </div>
        </div>
            `
        }

        else{
            message_element = `
            <div class="d-flex align-items-center justify-content-end m-b-5">
            <span class="msg_time_send text-grey position-static p-r-50"><span class="p-r-5">${dayName}</span><span class="p-r-5">${formattedDate}</span> ${formattedTime}</span>
            <div class="d-flex justify-content-end align-items-center">
                <div class="avatar-wrap  position-relative ic-29">
                    <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
                    ${logged_in_profile_tag}
                    </span>
                    <span class="online_icon"></span>
                </div>
                <p class="text-right font-weight-semibold ml-2">${logged_in_user_username}</p>
            </div> <!-- .d-flex -->
        </div> <!-- .d-flex -->

        <div class="text-right mb-4 replied">
            <div class="msg_cotainer_send d-flex justify-content-end">
                ${message}
            </div>
        </div>
            `
        }
    }
	else{
	    message_element = `
        <div class="d-flex justify-content-start align-items-center m-b-5">
        <div class="avatar-wrap position-relative ic-29">
            <span class="ic ic-avatar ic-29 has-avatar-icon has-cover-img">
            ${profile_pic}
            </span>
            <span class="online_icon"></span>
        </div>
        <p class="text-right font-weight-semibold ml-2">${user_name}</p>
        <span class="msg_time_send text-grey position-static p-l-50"><span class="p-r-5">${dayName}</span><span class="p-r-5">${formattedDate}</span>${formattedTime}</span>

    </div> <!-- .d-flex -->
    <div class="text-left mb-4 received">
        <div class="msg_cotainer d-inline-block m-0">
            ${message}
        </div>
    </div>
        `

    }

    let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')
	message_body.append($(message_element))
    message_body.animate({
        scrollTop: $(document).height()
    }, 100);

    if(sent_by_id != USER_ID){

        var chat_panel = $(`#chat_panel_${thread_id}`)
        chat_panel.hasClass("is_active")

        if (!(chat_panel.hasClass("is_active"))){
            
        $.ajax({
            url: "/30/CreateNotification/",
            type:"GET",
            data: {
            "user_id":USER_ID,
            "thread_id":thread_id
            },
            success: function (res) {
                entity_id = res["entity_id"]
                console.log(res);
                var count = $("#message_count").html();
                if(count){
                var integerNum = parseInt(count);
                integerNum = integerNum + 1;
                $("#message_count").html(`${integerNum}`);
                }
                else{
                $("#message_count").html(`1`);
                $("#message_count").removeClass("d-none");
                }

                var count = $(`#notification-count-${thread_id}`).html();
                if(count){
                var integerNum = parseInt(count);
                integerNum = integerNum + 1;
                $(`#notification-count-${thread_id}`).html(`${integerNum}`);
                }
                else{
                $(`#notification-count-${thread_id}`).html(`1`);
                $(`#notification-count-${thread_id}`).removeClass("d-none");
                }

                var count = $(`#notification-count-entity-${entity_id}`).html();
                if(count){
                var integerNum = parseInt(count);
                integerNum = integerNum + 1;
                $(`#notification-count-entity-${entity_id}`).html(`${integerNum}`);
                }
                else{
                $(`#notification-count-entity-${entity_id}`).html(`1`);
                $(`#notification-count-entity-${entity_id}`).removeClass("d-none");
                }



                
                
            },



            // Error handling
            error: function (error) {
                console.log(`Error ${error}`);
            }
            });
        
            

        }
        
    }
    
    

}


$('.contact-li').on('click', function (){
    $('.contacts .actiive').removeClass('active')
    $(this).addClass('active')

    // message wrappers
    let chat_id = $(this).attr('chat-id')
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[chat-id="' + chat_id +'"]').addClass('is_active')

})

function get_active_other_user_id(){
    let other_user_id = $('.messages-wrapper.is_active').attr('other-user-id')
    other_user_id = $.trim(other_user_id)
    return other_user_id
}

function get_active_thread_id(){
    let chat_id = $('.messages-wrapper.is_active').attr('chat-id')
    let thread_id = chat_id.replace('chat_', '')
    return thread_id
}

var ht = 0;
$(".msg_card_body div").each(function() {
  ht += $(this).height();
});
$(".msg_card_body-wrapper").animate({scrollTop: ht});