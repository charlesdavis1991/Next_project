import React from "react";


const Input = (props) => {
    return (
        <div>
            {props.flag ? 
            <div>
                 <div class="">
                    <input type={props.type || "text"} class="modal-input" placeholder={props.placeholder} disabled={props.disabled || false} />
                </div>
            </div> :
            <div class="row align-items-center">
                <div class="col-2 pr-0">
                    <label class="text-grey">{props.lable}</label>
                </div>
                <div class="col-10">
                    <input type={props.type || "text"} class="modal-input" placeholder={props.placeholder} disabled={props.disabled || false} />
                </div>

            </div>}
            
        </div>
    )
}
export default Input;