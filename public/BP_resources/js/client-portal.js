async function getDiscoveryQuestions(questionId, client_id) {
  try {
    const response = await fetch(
      `/30/getQuestionDetails/${client_id}/${questionId}/`
    );
    const data = await response.json();

    return [data, null];
  } catch (error) {
    return [null, error];
  }
}


async function loadAnswer(questionId, client_id) {
  const [discoveryQuestionsData, error] = await getDiscoveryQuestions(
    questionId,
    client_id
  );

  if (error) {
    return;
  }
  
  // Get currently active tab
  const activeTab = document.getElementById('discovery-qa').querySelector(".nav-link.active");
  const activeTabId = activeTab.getAttribute("data-tab");
  const answerDivs = [
    "discovery-questions-tab-1",
    "discovery-questions-tab-2",
    "discovery-questions-tab-3",
  ];
  console.log("hello running")
  answerDivs.forEach((div) => {
    let newDiv = document.getElementById(div);
    newDiv.style.display = "none";
  })
  console.log(activeTabId)
  console.log(document.getElementById(activeTabId))
  const container = document.getElementById(activeTabId);
  const answerTextArea = document.getElementById("discovery-answers-" + activeTabId);
  const questionHeading = document.getElementById("discovery-questions-"+activeTabId);
  container.style.display="block";
  console.log(container)
  const answer = discoveryQuestionsData.answer;
  answerTextArea.value = answer;
  answerTextArea.setAttribute("data-question-id", questionId);
  answerTextArea.setAttribute("data-client-id", client_id);
  questionHeading.innerHTML = discoveryQuestionsData.question;
}

async function postAnswer(questionId, client_id, answer) {
  try {
    const response = await fetch(
      `/30/clientDiscoveryQuestions/${client_id}/${questionId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      }
    );
    const data = await response.json();
    return [data, null];
  } catch (error) {
    return [null, error];
  }
}

async function answerOnChange(textArea) {
  console.log("changing");
  const answer = textArea.value;
  const questionId = textArea.getAttribute("data-question-id");
  const client_id = textArea.getAttribute("data-client-id");
  console.log(answer, questionId, client_id);
  const [data, error] = await postAnswer(questionId, client_id, answer);
  if (error) {
    console.log("ERROR");
    console.log(error);
    return;
  }
}

function changeTabs(elem) {
  const answerDivs = [
    "discovery-questions-tab-1",
    "discovery-questions-tab-2",
    "discovery-questions-tab-3",
  ];
  console.log("hello running")
  answerDivs.forEach((div) => {
    let newDiv = document.getElementById(div);
    newDiv.style.display = "none";
  })
  const tab = elem.getAttribute("data-tab");
  const tabs = document.querySelectorAll(".tab-content");
  console.log(tab)
  const container = document.getElementById(tab);
  container.style.display="block";
  const tabLinks = document.querySelectorAll(".nav-link");
  console.log(tabLinks);
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });
  tabLinks.forEach((tab) => {
    tab.classList.remove("active");
  });

  elem.classList.add("active");
}
(function () {
  const answerDivs = [
    "discovery-questions-tab-1",
    "discovery-questions-tab-2",
    "discovery-questions-tab-3",
  ];
  console.log("hello running")
  answerDivs.forEach((div) => {
    let newDiv = document.getElementById(div);
    newDiv.style.display = "none";
  })
  let firstDiv = document.getElementById("discovery-questions-tab-1");
  firstDiv.style.display = "block";
})()
