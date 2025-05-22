import React from 'react'
import { Table } from 'react-bootstrap';


const ModalBodyDiscovery = () => {

    const litigationDiscovery = [
        {
            date: '2024-01-01',
            litigation_type: 'Type A',
            from_defendant: { first_name: 'John', last_name: 'Doe' },
            to_defendant: { first_name: 'Jane', last_name: 'Smith' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        {
            date: '2024-01-15',
            litigation_type: 'Type B',
            from_defendant: { first_name: 'Alice', last_name: 'Johnson' },
            to_defendant: { first_name: 'Bob', last_name: 'Brown' },
        },
        // Add more sample data as needed
    ];

    return (
        <div className="container-fluid overflow-hidden ML5P-Disc">
            <div className="row" id="other-parties-page">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="">
                            <div className="custom-tab">
                                <div className="tab-content" id="nav-tabContent">
                                    <div
                                        className="tab-pane fade show active"
                                        id="custom-nav-home"
                                        role="tabpanel"
                                        aria-labelledby="custom-nav-home-tab"
                                    >
                                        <div className="panel-title height-25 d-flex align-items-center">
                                            <h4 className="m-0">Discovery Summary</h4>
                                            <div className="pancil position-static text-center d-flex align-items-center ml-auto">
                                                <img src="path_to_pencil_tool_image" alt="Pencil Tool" />
                                            </div>
                                        </div>
                                        <div className="table-responsive table--no-card m-b-20 table-img rounded-0">
                                            <Table striped className="has-height-25">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">No</th>
                                                        <th>Served</th>
                                                        <th>Due</th>
                                                        <th>Type</th>
                                                        <th>From</th>
                                                        <th>To</th>
                                                        <th colSpan={4}>Answered</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {litigationDiscovery.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.date}</td>
                                                            <td>-</td>
                                                            <td className="text-right">{item.litigation_type}</td>
                                                            <td className="text-right">
                                                                {item.from_defendant.first_name} {item.from_defendant.last_name}
                                                            </td>
                                                            <td>
                                                                {item.to_defendant.first_name} {item.to_defendant.last_name}
                                                            </td>
                                                            <td className="td-color">
                                                                <img src="path_to_file_icon" alt="File Icon" /> Rog answers
                                                            </td>
                                                            <td className="td-color">
                                                                <img src="path_to_file_icon" alt="File Icon" /> Interrogatories
                                                            </td>
                                                            <td className="td-color">
                                                                <img src="path_to_file_icon" alt="File Icon" /> Admissions
                                                            </td>
                                                            <td className="td-color">
                                                                <img src="path_to_file_icon" alt="File Icon" /> Specials
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalBodyDiscovery;


