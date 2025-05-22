function autocomplete_reports_information(inp, arr, arr_2) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    console.log('Input', inp)
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
          var reporting_agency = arr_2.map( function(item){ return item.reporting_agency })
          var reporter_firstname = arr_2.map( function(item){ return item.reporter_firstname })
          var reporter_lastname = arr_2.map( function(item){ return item.reporter_lastname })
          var title = arr_2.map( function(item){ return item.title })
          var cost = arr_2.map( function(item){ return item.cost })
          var report_taken = arr_2.map( function(item){ return item.report_taken })
          var completed = arr_2.map( function(item){ return item.completed })
          var date_taken = arr_2.map( function(item){ return item.date_taken })
          var report_type = arr_2.map( function(item){ return item.report_type })
          /*check if the item starts with the same letters as the text field value:*/
          if (reporting_agency[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || reporter_firstname[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || reporter_lastname[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || title[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || cost[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || completed[i].substr(0, val.length).toUpperCase() == val.toUpperCase() )  {
            if (arr_2.map( function(item) { return item.reporting_agency })[i] == null){
                reporting_agency[i] = ''
            }
            if (arr_2.map( function(item) { return item.reporter_firstname })[i] == null){
                reporter_firstname[i] = ''
            }
            if (arr_2.map( function(item) { return item.reporter_lastname })[i] == null){
                reporter_lastname[i] = ''
            }
            if (arr_2.map( function(item) { return item.title })[i] == null){
                title[i] = ''
            }
            if (arr_2.map( function(item) { return item.report_taken })[i] == null){
                report_taken[i] = ''
            }
            if (arr_2.map( function(item) { return item.cost })[i] == null){
                cost[i] = ''
            }
            if (arr_2.map( function(item) { return item.completed })[i] == null){
                completed[i] = ''
            }
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");

            b.setAttribute("class", "autocomplete-subitems");
            /*make the matching letters bold:*/
            // b.innerHTML = "<strong>" + arr_2[i].substr(0, val.length) + "</strong>";
            if (reporting_agency[i] != "") {
              b.innerHTML += reporting_agency[i]
              b.innerHTML += ', '
            }
            
            if (reporter_firstname[i] != "") {
              b.innerHTML +=  reporter_firstname[i];
            b.innerHTML += ', '
            }
            
            if (reporter_lastname[i] != "") {
              b.innerHTML +=  reporter_lastname[i];
            b.innerHTML += ', '
            }
           
            if (title[i] != "") {
              b.innerHTML +=  title[i];
            b.innerHTML += ', '
            }

            
            // b.innerHTML += arr_2[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + reporting_agency[i] +" , " + reporter_firstname[i]+" , " + reporter_lastname[i]+" , " + title[i]+" , "  + report_taken[i] +" , "+  completed[i]+" , "+  cost[i]+ " , "+  date_taken[i]+ " , "+  report_type[i]+ "'>";
            
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                input_array = inp.value.split(',')
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
                //  Add values in inputs
                console.log('Completed',input_array[5].slice(0, 11))
                console.log('Cost', typeof input_array[6])
                $(inp).parents('form').find('input[name="reporting_agency"]').val(input_array[0])
                $(inp).parents('form').find('input[name="reporter_firstname"]').val(input_array[1])
                $(inp).parents('form').find('input[name="reporter_lastname"]').val(input_array[2])
                $(inp).parents('form').find('input[name="reporter_title"]').val(input_array[3])
                // $(inp).parents('form').find('input[name="state"]').val(input_array[4])
                try {
                    // var date = (input_array[5].toString());
                    var comp = input_array[5].trim();
                    
                    console.log('comp', typeof comp)
                    var date = new Date(comp);
                    console.log('date',date)
                    var year = date.getFullYear();
                    var month = (date.getMonth() + 1).toString().padStart(2, '0');
                    var day = date.getDate().toString().padStart(2, '0');
                    
                    var formattedDate = `${year}-${month}-${day}`;
                    $(inp).parents('form').find('input[name="completed"]').val(formattedDate)
                } catch (error) {
                    console.log('error',error)
                }
                try {
                    // var date = (input_array[5].toString());
                    var comp = input_array[7].trim();
                    
                    var date = new Date(comp);
                    var year = date.getFullYear();
                    var month = (date.getMonth() + 1).toString().padStart(2, '0');
                    var day = date.getDate().toString().padStart(2, '0');
                    
                    var formattedDate = `${year}-${month}-${day}`;
                    $(inp).parents('form').find('input[name="date_taken"]').val(formattedDate)
                } catch (error) {
                    console.log('error',error)
                }
                $(inp).parents('form').find('input[name="reporter_cost"]').val(parseFloat(input_array[6]))
                try {
                  $(inp).parents('form').find('select[name="report_type_id"]').find('option').each(function() {
                    
                    // console.log('Option Value',$(this).val() , 'input_array',input_array[4].trim())
                    if ($(this).val() == input_array[8].trim()) {
                      // Set the selected property of the matched option to true
                      $(this).prop('selected', true);
                      // Break out of the loop since we found the matching option
                      return false;
                    }
                  });
                } catch (error) {
                  // console.log('error',error)
                }
                try {
                    if (input_array[4].trim() == 'true'){
                        $(inp).parents('form').find('input[name="report_taken"]').prop('checked', true);
                    }
                    else{
                        
                        $(inp).parents('form').find('input[name="report_taken"]').prop('checked', false);
                    }
                } catch (error) {
                    
                }
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
function search_filter_reports_information(this_element){
    console.log('Search filter function')
    var $this = $(this_element);
    $.ajax({ 
          method: "GET",
          url: `/30/search_filter_reports_information/`,
        
          success:function(response){
            
              /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
            // form_data = $this.parents('form').find('.comp_state').val('test state')
            // console.log(response.data[0])
            autocomplete_reports_information(this_element, response.data, response.data );
            console.log('Search filter function',response.data)
            
      
          },
          error:function(){
              console.log('save url is not working')
          }
        });
};
