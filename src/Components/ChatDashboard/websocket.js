class WebSocketInstance {
    socket = null;
    status = "inactive"
    clientId = ""
    caseId = ""
    sent_by = "";
    send_to = "";
    thread_id = "";
    user_name = "";
    profile_pic = ""; 

    connect(clientId, caseId) {
      const socketURL = `ws://localhost:8000/30/32/${clientId}/${caseId}/`;
    //   this.thread_id = threadId;
    //   this.sent_by = sendBy;
    //   this.send_to = sendTo;
    //   this.user_name = username;
    //   this.profile_pic = profilepic;
      this.socket = new WebSocket(socketURL);
      this.socket.onopen = this.onOpen.bind(this);
      this.socket.onmessage = this.onMessage.bind(this);
      this.socket.onclose = this.onClose.bind(this);
    }
  
    disconnect() {
      this.socket.close();
    }
  
    onOpen() {
      console.log('WebSocket connected');
      this.status = "active"
    }
  
    onClose() {
      console.log('WebSocket disconnected');
      this.status = "inactive"
    }
  
    onMessage(e) {
      const data = JSON.parse(e.data);
      // Handle incoming messages
      console.log("Incoming data: ", data)
    }
  
    sendMessage(message, threadId, sentBy, sendTo, username, profile_pic) {
      const data = {
        message,
        sent_by: sentBy,
        send_to: sendTo,
        thread_id: threadId,
        user_name: username,
        profile_pic: profile_pic
      };
      console.log(data)
      this.socket.send(JSON.stringify(data));
    }
}
  
export default WebSocketInstance;