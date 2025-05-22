function autocomplete_provider(inp, arr, arr_2) {
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
          var name = arr_2.map( function(item){ return item.name })
          var address1 = arr_2.map( function(item){ return item.address1 })
          var address2 = arr_2.map( function(item){ return item.address2 })
          var city = arr_2.map( function(item){ return item.city })
          var state = arr_2.map( function(item){ return item.state })
          var zip = arr_2.map( function(item){ return item.zip })
          var email = arr_2.map( function(item){ return item.email })
          var phone = arr_2.map( function(item){ return item.phone })
          var fax = arr_2.map( function(item){ return item.fax })
          var website = arr_2.map( function(item){ return item.website })
          var specialties = arr_2.map( function(item){ return item.specialties })
        //   console.log('specialties 1', specialties[i])
          /*check if the item starts with the same letters as the text field value:*/
          if (name[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || address1[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || address2[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || city[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || state[i].substr(0, val.length).toUpperCase() == val.toUpperCase() || zip[i].substr(0, val.length).toUpperCase() == val.toUpperCase() )  {
            if (arr_2.map( function(item) { return item.name })[i] == null){
                name[i] = ''
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
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");

            b.setAttribute("class", "autocomplete-subitems");
            /*make the matching letters bold:*/
            // b.innerHTML = "<strong>" + arr_2[i].substr(0, val.length) + "</strong>";
            if (name[i] != "") {
              b.innerHTML += name[i]
              b.innerHTML += ', '
            }
            
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
            
            b.innerHTML +=  zip[i];
            
            // b.innerHTML += arr_2[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + name[i] +" , " + address1[i]+" , " + address2[i]+" , " + city[i]+" , "  + state[i] +" , "+  zip[i]+" , "+  email[i]+" , "+  phone[i]+" , "+ fax[i]+" , "+  website[i]+ " , "+  specialties[i]+ "'>";
            
            /*execute a function when someone clicks on the item value (DIV element):*/
            b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                input_array = inp.value.split(',')
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
                //  Add values in inputs
                $(inp).parents('form').find('input[name="name"]').val(input_array[0])                
                $(inp).parents('form').find('input[name*="address"]:not([name*="address2"])').val(input_array[1])
                $(inp).parents('form').find('input[name*="address2"]').val(input_array[2])
                
                $(inp).parents('form').find('input[name*="city"]').val(input_array[3])
                $(inp).parents('form').find('input[name*="post_code"]').val(input_array[5])
                $(inp).parents('form').find('input[name*="email"]').val(input_array[6])
                try {
                    
                  $(inp).parents('form').find('input[name*="phone"]').val(input_array[7])
                } catch (error) {
                  
                }
                $(inp).parents('form').find('input[name*="fax"]').val(input_array[8])
                try {
                    $(inp).parents('form').find('select[name*="state"]').each(function() {
                        var options = $(this).find('option');
                
                        for (var i = 0; i < options.length; i++) {
                            if (options[i].value.trim() == input_array[4].trim()) {
                                options[i].selected = true;
                                break; // Break out of the loop after selecting the first match
                            }
                        }
                    });
                } catch (error) {
                    // console.log('error', error);
                }
                
                try {                  
                  $(inp).parents('form').find('input[name="website"]').val(input_array[9].trim())
                  
                  } catch (error) {
                    
                  }
                var specialtiesArray = input_array[10].split(':')
                console.log('Specialitites',specialtiesArray)
                var allCheckboxes = $(inp).parents('form').find('input[type="checkbox"]');
                allCheckboxes.each(function() {
                    var checkbox = $(this);
                    
                    console.log('checkbox.val()',checkbox.val())
                    var checkboxValue = checkbox.val().trim();
    
                    // Check if the trimmed checkbox value is in specialtiesArray
                    if (specialtiesArray.some(value => value.trim() === checkboxValue)) {
                        // If it is, check the checkbox and trigger the change event
                        checkbox.prop('checked', true).change();
                    } else {
                        // If it's not, uncheck the checkbox
                        checkbox.prop('checked', false).change();
                    }
                });
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
function search_filter_provider(this_element){
    // console.log('Search filter function')
    var $this = $(this_element);
    $.ajax({ 
          method: "GET",
          url: `/30/search_filter_provider/`,
        
          success:function(response){            
            autocomplete_provider(this_element, response.data, response.data );
            // console.log('Search filter function',response.data)
          },
          error:function(){
              console.log('search url is not working')
          }
        });
};
