const div = document.querySelector('.treatment-date')
const total_bill =document.querySelector('.total-bill')
const treating = document.querySelector('.treating')


function changeTreatmentText(){
    if(window.innerWidth<=992 || window.innerWidth<=1515){
        div.textContent='Dates'
        div.style.marginRight='5px'
     }
     else{
         div.textContent='Treatment Dates'
     }
}

    
function changeBillText(){
    if(window.innerWidth<=992 || window.innerWidth<=1515){
        total_bill.textContent='Bills'
        treating.textContent='Treating'
          
     }
     else{
        treating.textContent='Still Treating'
        total_bill.textContent='Total Bills'
     }
}




window.addEventListener('DOMContentLoaded',function(e){
changeTreatmentText()

changeBillText()

})


window.addEventListener('resize',changeTreatmentText)
window.addEventListener('resize',noteBtns)
window.addEventListener('resize',changeBillText)


