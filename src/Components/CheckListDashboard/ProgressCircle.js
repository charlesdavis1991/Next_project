import React, {useState, useEffect} from "react";


const ProgressCircle = ({case_percentage}) => {

    // console.debug("ProgressCircle : ",case_percentage)

    const [role, setRole] = useState("has-light-green")


    useEffect(() => {
        case_percentage < 5 ? setRole("has-light-gray") : 
        case_percentage < 10 ? setRole("has-light-blue") : 
        case_percentage < 15 ? setRole("has-sky-blue") : 
        case_percentage < 20 ? setRole("has-blue-jeans") : 
        case_percentage < 25 ? setRole("has-vivid-cerulean") : 
        case_percentage < 30 ? setRole("has-button-blue") : 
        case_percentage < 35 ? setRole("has-has-blueberry") : 
        case_percentage < 40 ? setRole("has-dark-blueberry") : 
        case_percentage < 45 ? setRole("has-dark-violet") : 
        case_percentage < 50 ? setRole("has-amethyst") : 
        case_percentage < 55 ? setRole("has-rosepink") : 
        case_percentage < 60 ? setRole("has-mulberry") : 
        case_percentage < 65 ? setRole("has-carmin-pink") : 
        case_percentage < 70 ? setRole("has-orange-soda") : 
        case_percentage < 75 ? setRole("has-carrot-orange") : 
        case_percentage < 80 ? setRole("has-princeton-orange") : 
        case_percentage < 85 ? setRole("has-orange") : 
        case_percentage < 90 ? setRole("has-gold") : 
        case_percentage < 95 ? setRole("has-dark-yellow") : 
        case_percentage < 99 ? setRole("has-avocado") : 
        case_percentage < 100 ? setRole("has-light-green") : setRole("has-light-green")
    }, [])
     
    

    return (
        <button className="text-black" type="button"  >
            <span className="checklist-wo-header-text-align-center-align-items-center-justify-content-center-display-flex">
                <div className="progressbarcircle" role={role}
                  aria-valuenow="65" aria-valuemin="0" aria-valuemax="100" style={{"--value":  case_percentage}}>
                </div>
            </span>
        </button>
    )
}

export  default ProgressCircle;