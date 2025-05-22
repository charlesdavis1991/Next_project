import React from 'react'

const GenericContactTab = () => {
    return (
        <>
            <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">Address 1:</span>
                </div>
                <div className="col-md-10">
                    {/* <input type="text" placeholder="Enter Address 1" className="form-control" name="address1" value={formData.address1} onChange={handleChange} /> */}
                    <input type="text" placeholder="Enter Address 1" className="form-control" name="address1" />
                </div>
            </div>

            <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">Address 2:</span>
                </div>
                <div className="col-md-10">
                    {/* <input type="text" placeholder="Enter Address 2" className="form-control" name="address2" value={formData.address2} onChange={handleChange} /> */}
                    <input type="text" placeholder="Enter Address 2" className="form-control" name="address2" />
                </div>
            </div>

            <div className="row align-items-center custom-margin-bottom">
                <div className="col-md mb-md-3 d-md-flex">
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center MR-63-Px">City:</span>
                    {/* <input type="text" placeholder="Enter City" className="form-control col-md-8" name="city" value={formData.city} onChange={handleChange} /> */}
                    <input type="text" placeholder="Enter City" className="form-control col-md-8" name="city" />
                </div>
                <div className="col-md mb-md-3 d-md-flex ml-md-3">
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-5">State:</span>
                    {/* <select name="state" value={formData.state} onChange={handleChange} className="form-select form-control col-md-9"> */}
                    <select name="state" className="form-select form-control col-md-9">
                        <option value="CA">California</option>
                        <option value="IL">Illinois</option>
                        <option value="TX">Texas</option>
                        <option value="AZ">Arizona</option>
                        <option value="FL">Florida</option>
                        <option value="NY">New York</option>
                        <option value="WA">Washington</option>
                        <option value="NV">Nevada</option>
                        <option value="MI">Michigan</option>
                        <option value="MA">Massachusetts</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="OH">Ohio</option>
                        <option value="MN">Minnesota</option>
                        <option value="VA">Virginia</option>
                        <option value="UT">Utah</option>
                        <option value="NC">North Carolina</option>
                        <option value="MD">Maryland</option>
                        <option value="GA">Georgia</option>
                        <option value="MO">Missouri</option>
                        <option value="HI">Hawaii</option>
                        <option value="IN">Indiana</option>
                        <option value="WI">Wisconsin</option>
                        <option value="CT">Connecticut</option>
                        <option value="TN">Tennessee</option>
                        <option value="NJ">New Jersey</option>
                        <option value="OR">Oregon</option>
                        <option value="OK">Oklahoma</option>
                        <option value="KY">Kentucky</option>
                        <option value="CO">Colorado</option>
                        <option value="DC">District of Columbia</option>
                        <option value="NM">New Mexico</option>
                        <option value="AL">Alabama</option>
                        <option value="RI">Rhode Island</option>
                        <option value="KS">Kansas</option>
                        <option value="NE">Nebraska</option>
                        <option value="DE">Delaware</option>
                        <option value="SC">South Carolina</option>
                        <option value="IA">Iowa</option>
                        <option value="ID">Idaho</option>
                        <option value="LA">Louisiana</option>
                        <option value="NH">New Hampshire</option>
                        <option value="AR">Arkansas</option>
                        <option value="AK">Alaska</option>
                        <option value="ME">Maine</option>
                        <option value="MS">Mississippi</option>
                        <option value="SD">South Dakota</option>
                        <option value="WV">West Virginia</option>
                        <option value="ND">North Dakota</option>
                        <option value="VT">Vermont</option>
                        <option value="MT">Montana</option>
                        <option value="WY">Wyoming</option>
                    </select>
                </div>
                <div className="col-md d-md-flex mb-3">
                    <span className="d-inline-block white-space-nowrapping text-grey align-self-center p-0 pl-md-3 pr-md-3 col-md-4">Zip:</span>
                    {/* <input type="text" placeholder="Enter Zip" className="form-control col-md-8" name="zip" value={formData.zip} onChange={handleChange} /> */}
                    <input type="text" placeholder="Enter Zip" className="form-control col-md-8" name="zip" />
                </div>
            </div>

            <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">Phone:</span>
                </div>
                <div className="col-md-10">
                    {/* <input type="text" placeholder="(###) ###-####" className="form-control" name="phone" value={formData.phone} onChange={handleChange} onKeyUp={(e) => { /* formatPhoneNumber logic here */ }
                    <input type="text" placeholder="(###) ###-####" className="form-control" name="phone" onKeyUp={(e) => { /* formatPhoneNumber logic here */ }} />
                </div>
            </div>

            <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">Extension:</span>
                </div>
                <div className="col-md-10">
                    {/* <input type="number" placeholder="Extension" className="form-control" name="extension" value={formData.extension} onChange={handleChange} /> */}
                    <input type="number" placeholder="Extension" className="form-control" name="extension" />
                </div>
            </div>

            <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">Fax:</span>
                </div>
                <div className="col-md-10">
                    {/* <input type="text" placeholder="(###) ###-####" className="form-control" name="fax" value={formData.fax} onChange={handleChange} onKeyUp={(e) => { /* formatPhoneNumber logic here */ }
                    <input type="text" placeholder="(###) ###-####" className="form-control" name="fax" onKeyUp={(e) => { /* formatPhoneNumber logic here */ }} />
                </div>
            </div>

            <div className="row align-items-center custom-margin-bottom">
                <div className="col-md-2 text-left">
                    <span className="d-inline-block text-grey">Email:</span>
                </div>
                <div className="col-md-10">
                    {/* <input type="email" placeholder="Enter Email" className="form-control" name="email" value={formData.email} onChange={handleChange} /> */}
                    <input type="email" placeholder="Enter Email" className="form-control" name="email" />
                </div>
            </div>
        </>
    )
}

export default GenericContactTab