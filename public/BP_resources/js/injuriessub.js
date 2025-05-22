async function fetchData(body_part, client_id, case_id, client_exists) {
    const response = await fetch(`${window.location.origin}/30/addInjury/${client_id}/${case_id}/`, {
        method: "POST", headers: {
            "Content-Type": "application/json",
        }, body: JSON.stringify({body_part: body_part, client: client_exists}),
    });
    return await response.json();
}

function formatPhoneNumber(val) {
    return val.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
}

function handleUnsuccessfulDataFetch(elem) {
    elem.checked = true;
    let myModal = new bootstrap.Modal(document.getElementById("myModal"), {});
    myModal.show();
}

function updateBodyPartImages(data) {
    let svgbody = document.getElementById("body-svg-images");
    let spinebody = document.getElementById("spine-svg-images");

    svgbody.innerHTML = generateImageTags(data, "body");
    spinebody.innerHTML = generateImageTags(data, "spine");
}

function generateImageTags(data, bodyPartType) {
    const injuriesColor = {
        red: data.red_injuries, orange: data.orange_injuries, green: data.green_injuries, blue: data.blue_injuries,
    };

    const urls = bodyPartType === "body" ? data.body_url : data.spine_url;
    const base_img = bodyPartType === "body" ? data.base_image : data.spine_base_image;

    const imgs = urls
        .map((url) => {
            const color = Object.keys(injuriesColor).find((color) => injuriesColor[color].includes(url[1]));
            return color ? `<img src="${data.static_path}${url[0][color]}" id="${url[1]}" alt="Responsive image" class="svg" style="max-height: 500px; display: inherit;" >` : "";
        })
        .join("\n");

    return `<img src="${data.static_path}${base_img}" class="svg-base" alt="Responsive image" style="max-height: 500px;">${imgs}`;
}

function updateInjuryTable(data) {
    let tbody = document.getElementById("injuries-table");

    // Clear all rows from the table
    tbody.innerHTML = "";

    if (data.table_provider && data.table_provider.length) {
        tbody.innerHTML += generateInjuryRows(data).join("\n");
    }
    try {
        const url = `${window.location.origin}/30/injury-doc-upload/`
        initializeDropzone('.dropzone-injury-upload', url);
        $('.no-provider-exists').each(function () {
            $(this).on('click', function (event) {
                event.stopPropagation();
                $("#noProviderModal").modal('show')
            });
        });
    } catch (e) {
        console.error("Error initializing Dropzone:", e);
    }

}

function generateInjuryRows(data) {
    const generateRow = (injury, detail, static_path) => {
        if (!!detail) {
            return `
      <tr onclick="addProviderFields('${injury.id}', this)"
          class="hover has-speciality-color-${detail.specialty_id}"
          data-body-part="${injury.body_part}"
          injury-id="${injury.id}"
          id="injury_row${injury.id}">
          <td class="td-autosize">
              <div>${injury.id}</div>
          </td>
          <td class="td-autosize">
              <div>${injury.body_part}</div>
          </td>
          <td class="provider-field td-autosize td_provider_name${injury.id} bg-speciality-10"
              id="provider-td">
              <div class="d-flex">
                  <div class="td_name${injury.id} d-flex align-items-center p-1 h-100 m-r-5 text-center justify-content-center font-weight-600 color-white"
                      style="background: ${detail.color};"
                      id="max-h-25">
                      <p>${detail.provider_name.slice(0, 1)}</p>
                  </div>
                  <div class="align-self-center">
                      <p>${detail.treating_provider}</p>
                  </div>
              </div>
          </td>
          <td class="td-autosize td_phone${injury.id}">
              <div>
                  ${formatPhoneNumber(detail.provider_phone)}
              </div>
          </td>
          <td class="td-autosize td_file${injury.id}">
          
              <div class="d-flex justify-content-center align-items-center">
            ${detail.doc_id ? ` 
                  <img class=""
                       onclick="handleClick(event,${detail.doc_id}, '')"
                      src="${static_path}BP_resources/images/icon/documents-icon-color.svg"
                      alt="document-icon" height="24px">` : `<img class="gray-scale-1 dropzone-injury-upload"
                         data-injury-id="${injury.id}"
                         data-detail-id="${detail.id}"
                         src="${static_path}BP_resources/images/icon/documents-icon-color.svg"
                         alt="document-icon" height="24px">`}
          </td>
          <td class="w-100 td_note${injury.id}">
              <div>
                  <p>${detail.note}</p>
              </div>
          </td>
      </tr>`;
        } else {
            return `
      <tr onclick="addProviderFields('${injury.id}', this)"
          class="hover"
          data-body-part="${injury.body_part}"
          injury-id="${injury.id}"
          id="injury_row${injury.id}">
          <td class="td-autosize">
              <div>${injury.id}</div>
          </td>
          <td class="td-autosize">
              <div>${injury.body_part}</div>
          </td>
          <td class="provider-field td-autosize td_provider_name${injury.id} bg-speciality-10"
              id="provider-td">
              <div class="d-flex">
                  <div class="td_name${injury.id} d-flex align-items-center p-1 h-100 m-r-5 text-center justify-content-center font-weight-600 color-white"
                      id="max-h-25">
                      <p></p>
                  </div>
                  <div class="align-self-center">
                      <p></p>
                  </div>
              </div>
          </td>
          <td class="td-autosize td_phone${injury.id}">
              <div>
              </div>
          </td>
          <td class="td-autosize td_file${injury.id}">
              <div class="d-flex justify-content-center align-items-center">
                  <img class="gray-scale-1 no-provider-exists"
                      src="${static_path}BP_resources/images/icon/documents-icon-color.svg"
                      alt="document-icon" height="24px">
              </div>
          </td>
          <td class="w-100 td_note${injury.id}">
              <div>
                  <p></p>
              </div>
          </td>
      </tr>`;
        }
    };

    const rows = data.table_provider
        .flatMap((injury) => {
            if (injury.provider_details.length === 0) {
                return generateRow(injury, null, data.static_path);
            } else {
                return injury.provider_details.map((detail) => generateRow(injury, detail, data.static_path)).join('');
            }
        });

    return rows;
}


async function addBodyPartHelper(body_part, elem, client_id, case_id, color_class = "red-accent-color", client_exists = false) {
    let element = document.getElementById(body_part);
    const data = await fetchData(body_part, client_id, case_id, client_exists);
    console.log("Success:", data);
    if (!data.success) {
        handleUnsuccessfulDataFetch(elem);
        return;
    }
    console.log("elem")
    console.log(elem)
    if (elem) {
        elem.classList.add(color_class);
    }
    updateBodyPartImages(data);
    updateInjuryTable(data);
}

let providerFields = document.querySelectorAll(".provider-field");
providerFields.forEach((field) => {
    field.addEventListener("click", (e) => {
        e.stopPropagation();
        let bsModal = new bootstrap.Modal(document.getElementById("comm-with-provider"), {});
        bsModal.show();
    });
})
