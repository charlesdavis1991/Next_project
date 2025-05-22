import React from 'react';
import Select, { components } from 'react-select';

const CustomSelect = () => {
  const options = [
    { value: 'Case', label: 'Case', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/case-icon-color_gIGzPMA.svg' },
    { value: 'Client', label: 'Client', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/client-icon-color_KismKtn.svg' },
    { value: 'Accident', label: 'Accident', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/car-accident-icon-color_w060Q2v.svg' },
    { value: 'Reports', label: 'Reports', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/incident-folder-icon-color_ISjV4RF.svg' },
    { value: 'Treatment', label: 'Treatment', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/medical-treatment-icon-color_c8vboXY.svg' },
    { value: 'Injury', label: 'Injury', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/injuries-icon-color_V7G2kdz.svg' },
    { value: 'To Do', label: 'To Do', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/to-do-icon-color_PyU3ldW.svg' },
    { value: 'Defendants', label: 'Defendants', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/defendants-icon-color-final.svg' },
    { value: 'Witnesses', label: 'Witnesses', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/witnesses-icon-color_iYKDd0f.svg' },
    { value: 'Parties', label: 'Parties', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/other-parties-icon-color_i60nUMt.svg' },
    { value: 'Insurance', label: 'Insurance', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/insurance-icon-color_2pFtjE8.svg' },
    { value: 'Loans', label: 'Loans', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/case-loans-icon-color.svg' },
    { value: 'Costs', label: 'Costs', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/costs-icon-color_Iw0rjvm.svg' },
    { value: 'Settle', label: 'Settle', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/settlement-icon-color_lfIgUlF.svg' },
    { value: 'Litigation', label: 'Litigation', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/litigation-icon-color_5xPGzjY.svg' },
    { value: 'Discovery', label: 'Discovery', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/discovery-icon-color_97Wb0rd.svg' },
    { value: 'Depos', label: 'Depos', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/depositions-icon-color_cSDmNUF.svg' },
    { value: 'Experts', label: 'Experts', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/experts-icon-color_10hcaau.svg' },
    { value: 'Time Page', label: 'Time Page', icon: 'https://simplefirm-bucket.s3.amazonaws.com/static/images/time-a-clock-icon.svg' },
  ];

  const customStyles = {
    option: (provided) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
    }),
    menu: (provided) => ({
      ...provided,
      width: '200px', // Adjust the width as needed
      padding:"0"
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color :"#0A3761",
        fontWeight: "bold"
      }),
      control: (provided) => ({
        ...provided,
        minHeight: '15px', // Set the height
        borderRadius: '0px', // Set the border-radius
      }),
      indicatorSeparator: (provided) => ({
        ...provided,
        display: 'none', // Hide the indicator separator
      }),
  };

  const ValueContainer = ({ children, ...props }) => {
    const label = props.selectProps.inputValue || (props.selectProps.value && props.selectProps.value.label);
    const icon = props.selectProps.value && props.selectProps.value.icon;

    return (
      <components.ValueContainer {...props} className='d-flex'>
        {icon && <img src={icon} alt={label} className="mr-1 width-height-10" />}
        {children}
      </components.ValueContainer>
    );
  };

  const Option = ({ innerProps, label, data }) => (
    <div {...innerProps} className="d-flex align-items-center">
      {data.icon && <img src={data.icon} alt={label} className="mr-1 width-height-10" />}
      <span>{label}</span>
    </div>
  );
  
  return (
    <Select
      options={options}
      components={{ ValueContainer, Option }}
      styles={customStyles}
    />
  );
};

export default CustomSelect;
