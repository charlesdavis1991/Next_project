function format_phone_fax(phoneNumberInput) {
  var inputVal = (phoneNumberInput);
  // Remove all non-digit characters
  inputVal = inputVal.replace(/\D/g, '');
  // Insert formatting characters
  inputVal = '(' + inputVal.substring(0, 3) + ') ' + inputVal.substring(3, 6) + '-' + inputVal.substring(6, 10);
  // Update input value
  return inputVal
}
function autocomplete_specific_adjuster(inp, arr, arr_2) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    // console.log('Input', inp)
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          var company_name = arr_2.map( function(item){ return item.company_name })
          var address1 = arr_2.map( function(item){ return item.address1 })
          var address2 = arr_2.map( function(item){ return item.address2 })
          var city = arr_2.map( function(item){ return item.city })
          var state = arr_2.map( function(item){ return item.state })
          var zip = arr_2.map( function(item){ return item.zip })
          var email = arr_2.map( function(item){ return item.email })
          var phone = arr_2.map( function(item){ return item.phone })
          var fax = arr_2.map( function(item){ return item.fax })
          var adjuster_firstname = arr_2.map( function(item){ return item.adjuster_firstname })
          var adjuster_lastname = arr_2.map( function(item){ return item.adjuster_lastname })
          var policy_number = arr_2.map( function(item){ return item.policy_number })
          var claim_number = arr_2.map( function(item){ return item.claim_number })
          var insurance_type = arr_2.map( function(item){ return item.insurance_type })
          var extension = arr_2.map( function(item){ return item.extension })

          
            // console.log('insurance_type',insurance_type)
          /*check if the item starts with the same letters as the text field value:*/
          if (company_name[i].substr(0, val.length).toUpperCase() == val.toUpperCase()  || address1[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || address2[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || city[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || state[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || zip[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || adjuster_firstname[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || adjuster_lastname[i].substr(0, val.length).toUpperCase() == val.toUpperCase() )  {
            if (arr_2.map( function(item) { return item.company_name })[i] == null){
                company_name[i] = ''
            }
            if (arr_2.map( function(item) { return item.adjuster_firstname })[i] == null){
                adjuster_firstname[i] = ''
            }
            if (arr_2.map( function(item) { return item.adjuster_lastname })[i] == null){
                adjuster_lastname[i] = ''
            }
            if (arr_2.map( function(item) { return item.policy_number })[i] == null){
                policy_number[i] = ''
            }
            if (arr_2.map( function(item) { return item.claim_number })[i] == null){
                claim_number[i] = ''
            }
            if (arr_2.map( function(item) { return item.insurance_type })[i] == null){
                insurance_type[i] = ''
            }
            if (arr_2.map( function(item) { return item.address1 })[i] == null){
              address1[i] = ''
            }
            if (arr_2.map( function(item) { return item.address2 })[i] == null){
              address2[i] = ''
            }
            if (arr_2.map( function(item) { return item.city })[i] == null){
              city[i] = ''
            }
            if (arr_2.map( function(item) { return item.state })[i] == null){
              state[i] = ''
            }
            if (arr_2.map( function(item) { return item.zip })[i] == null){
              zip[i] = ''
            }
            if (arr_2.map( function(item) { return item.email })[i] == null){
              email[i] = ''
            }
            if (arr_2.map( function(item) { return item.phone })[i] == null){
              phone[i] = ''
            }
            if (arr_2.map( function(item) { return item.fax })[i] == null){
              fax[i] = ''
            }
            if (arr_2.map( function(item) { return item.extension })[i] == null){
              extension[i] = ''
            }
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");

            b.setAttribute("class", "autocomplete-subitems");
            /*make the matching letters bold:*/
            // b.innerHTML = "<strong>" + arr_2[i].substr(0, val.length) + "</strong>";
            // if (company_name[i] != "") {
            //   b.innerHTML +=  company_name[i];
            // b.innerHTML += ', '
            // }

            if (adjuster_firstname[i] != "") {
              b.innerHTML +=  adjuster_firstname[i];
            b.innerHTML += ' '
            }

            if (adjuster_lastname[i] != "") {
              b.innerHTML +=  adjuster_lastname[i];
            b.innerHTML += ', '
            }

            b.innerHTML +=  company_name[i];            
            if (address1[i] != "") {
              b.innerHTML +=  address1[i];
            b.innerHTML += ', '
            }

            if (address2[i] != "") {
              b.innerHTML +=  address2[i];
            b.innerHTML += ', '
            }
           
            if (city[i] != "") {
              b.innerHTML +=  city[i];
            b.innerHTML += ', '
            }

            if (state[i] != "") {
              b.innerHTML +=  state[i];
              b.innerHTML += ', '
            }
            
            if (zip[i] != "") {
              b.innerHTML +=  zip[i];
              b.innerHTML += ', '
            }
            b.innerHTML +=  'Phone:';
            
            if (phone[i] != "") {
              b.innerHTML +=  format_phone_fax(phone[i]);
              b.innerHTML += ', '
            }
            b.innerHTML +=  'Fax:';
            
            if (fax[i] != "") {
              b.innerHTML +=  format_phone_fax(fax[i]);
              b.innerHTML += ', '
            }
            if (email[i] != "") {
              b.innerHTML +=  email[i];
              // b.innerHTML += ', '
            }
            
            // b.innerHTML += arr_2[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + company_name[i] +" , " + adjuster_firstname[i] +" , " + adjuster_lastname[i] +" , " + address1[i]+" , " + address2[i]+" , " + city[i]+" , "  + state[i] +" , "+  zip[i]+" , "+  email[i]+" , "+  phone[i]+" , "+ fax[i]+" , "+ policy_number[i]+" , "+ claim_number[i]+" , "+ insurance_type[i]+" , "+ extension[i]+ "'>";
            
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                
                inp.value = this.getElementsByTagName("input")[0].value;
                
                input_array = inp.value.split(',')
                
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
                //  Add values in inputs
                
                $(inp).parents('form').find('input[name="adjuster_fname"]').val(input_array[1].trim())
                $(inp).parents('form').find('input[name="adjuster_lname"]').val(input_array[2].trim())
                inp.value = "";
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
  }
//   var keywords = ["Sevan Podcast","Coffee Pods and Wods","Clydesdale Media","Training Think Tank","Misfit Athletics"];
    
//               /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
             
// autocomplete(document.getElementById("myInput"), keywords);
function format_phone_fax(phoneNumberInput) {
  var inputVal = (phoneNumberInput);
  // Remove all non-digit characters
  inputVal = inputVal.replace(/\D/g, '');
  // Insert formatting characters
  inputVal = '(' + inputVal.substring(0, 3) + ') ' + inputVal.substring(3, 6) + '-' + inputVal.substring(6, 10);
  // Update input value
  return inputVal
}
function search_filter_specific_adjuster(this_element){
    console.log('Search filter function',$(this_element).parents('form').find('input[name="company_name"]'))
    var $this = $(this_element);
    console.log('COMPANY NAME', $(this_element).parents('form').find('input[name="company_name"]').val())
    $.ajax({ 
          method: "POST",
          url: `/30/search_filter_specific_adjuster/`,
            data:{
                'company_name':$(this_element).parents('form').find('input[name="company_name"]').val()
            },
          success:function(response){
            
              /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
            // form_data = $this.parents('form').find('.comp_state').val('test state')
            // console.log(response.data[0])
            autocomplete_specific_adjuster(this_element, response.data, response.data );
            // console.log('Search filter function',response.data)
            
      
          },
          error:function(){
              console.log('save url is not working')
          }
        });
};
