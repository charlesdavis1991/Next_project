import React from "react";
import Form from 'react-bootstrap/Form';

const CustomSelect = (props) => {
    return (
        <>
            {props.flag ? <div>
                <Form.Select aria-label="Default select example" className="custome-slect">
                    <option>select</option>
                    <option value="1">One</option>
                    <option value="2">Two</option>
                    <option value="3">Three</option>
                </Form.Select>
            </div> :
                <div class="row align-items-center">
                    <div class="col-2 pr-0">
                        <label class="text-grey">{props.lable}</label>
                    </div>
                    <div class="col-10">
                        <Form.Select aria-label="Default select example" className="custome-slect">
                            <option>select</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </Form.Select>
                    </div>

                </div>
            }
        </>
    )
}
export default CustomSelect;