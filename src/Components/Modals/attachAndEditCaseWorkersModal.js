import React from 'react';

const AttachOrEditCaseWorkerModal = ({ setOpen, open }) => {

    return (
        <div className={`modal ${open ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!open}>
          <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header bg-primary justify-content-center">
					<h5 class="modal-title text-white" id="exampleModalLabel">Attach and Edit Case Workers Assigned to Case</h5>
				</div>
				<div class="modal-body">

					<table class="table">
						<tr>
							<td class= "border-0px-padding-0px-0px-10px-10px">
                                Name1
                                {/* {{user_type1.name}}: */}

                                </td>
							<td class="border-0px-padding-0px-0px-10px-10px drop-down">
								<select class="form-select custom-select" aria-label=""
									id="user_type1">
									{/* {% for firm_role in firm_roles %}
									{% if user_type1 in firm_role.for_firm_usertype.all %}
									{% if firm_role.for_firm_user.id == case.firm_user1.id %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" value="{{firm_role.for_firm_user.id}}" selected><span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
											</span>{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" value="{{firm_role.for_firm_user.id}}" selected><span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
											</span>{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% else %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option data-image="{{ firm_role.for_firm_user.profile_pic_19p.url }}" value="{{firm_role.for_firm_user.id}}"><span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
											</span>{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" value="{{firm_role.for_firm_user.id}}"><span class="ic ic-avatar ic-19 has-avatar-icon has-cover-img ">
											</span>{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% endif %}
									{% endif %}
									{% endfor %} */}

								</select></td>
							<td class= "border-0px-padding-0px-0px-10px-10px">
                                Name:
                                {/* {{user_type4.name}}: */}

                                </td>
							<td class= "border-0px-padding-0px-0px-10px-10px drop-down"> <select class="form-select custom-select" aria-label=""
									id="user_type4">
									{/* {% for firm_role in firm_roles %}
										{% if user_type4 in firm_role.for_firm_usertype.all %}
											{% if firm_role.for_firm_user.id == case.firm_user4.id %}
												{% if firm_role.for_firm_user.profile_pic_19p %}
													<option value="{{firm_role.for_firm_user.id}}" selected data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
														{{firm_role.for_firm_user.user.last_name}}</option>
													{% else %}
													<option value="{{firm_role.for_firm_user.id}}" data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
														{{firm_role.for_firm_user.user.last_name}}</option>
												{% endif %}
												{% else %}
													{% if firm_role.for_firm_user.profile_pic_19p %}
														<option value="{{firm_role.for_firm_user.id}}" data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
															{{firm_role.for_firm_user.user.last_name}}</option>
														{% else %}
														<option value="{{firm_role.for_firm_user.id}}" data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
															{{firm_role.for_firm_user.user.last_name}}</option>
													{% endif %}
											{% endif %}
										{% endif %}
									{% endfor %} */}
								</select></td>
						</tr>

						<tr>
							<td class= "border-0px-padding-0px-0px-10px-10px">
                                Name2:
                                {/* {{user_type2.name}}: */}

                                </td>
							<td class= "border-0px-padding-0px-0px-10px-10px drop-down"> <select class="form-select custom-select" aria-label=""
									id="user_type2">
									{/* {% for firm_role in firm_roles %}
									{% if user_type2 in firm_role.for_firm_usertype.all %}
									{% if firm_role.for_firm_user.id == case.firm_user2.id %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% else %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% endif %}
									{% endif %}
									{% endfor %} */}

								</select></td>
							<td class= "border-0px-padding-0px-0px-10px-10px">
                                Name2:
                                {/* {{user_type5.name}}: */}

                                </td>
							<td class= "border-0px-padding-0px-0px-10px-10px drop-down">
                                 <select class="form-select custom-select" aria-label=""
									id="user_type5">
									{/* {% for firm_role in firm_roles %}
									{% if user_type5 in firm_role.for_firm_usertype.all %}
									{% if firm_role.for_firm_user.id == case.firm_user5.id %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% else %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% endif %}
									{% endif %}
									{% endfor %} */}
								</select></td>
						</tr>
						<tr>
							<td class= "border-0px-padding-0px-0px-10px-10px">
                                {/* {{user_type3.name}}: */}

                                </td>
							<td class= "border-0px-padding-0px-0px-10px-10px drop-down"> <select class="form-select custom-select" aria-label=""
									id="user_type3">
									{/* {% for firm_role in firm_roles %}
									{% if user_type3 in firm_role.for_firm_usertype.all %}
									{% if firm_role.for_firm_user.id == case.firm_user3.id %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% else %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% endif %}
									{% endif %}
									{% endfor %} */}
								</select></td>
							<td class= "border-0px-padding-0px-0px-10px-10px">
                                Name4:
                                {/* {{user_type6.name}}: */}
                                </td>
							<td class= "border-0px-padding-0px-0px-10px-10px drop-down"> <select class="form-select custom-select" aria-label=""
									id="user_type6">
									{/* {% for firm_role in firm_roles %}
									{% if user_type6 in firm_role.for_firm_usertype.all %}
									{% if firm_role.for_firm_user.id == case.firm_user6.id %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" selected data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% else %}
										{% if firm_role.for_firm_user.profile_pic_19p %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="{{firm_role.for_firm_user.profile_pic_19p.url}}" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
											{% else %}
											<option value="{{firm_role.for_firm_user.id}}" data-image="https://simplefirm-bucket.s3.amazonaws.com/static/bp_assets/img/avatar.svg" >{{firm_role.for_firm_user.user.first_name}}
												{{firm_role.for_firm_user.user.last_name}}</option>
										{% endif %}
									{% endif %}
									{% endif %}
									{% endfor %} */}

								</select></td>
						</tr>

					</table>

				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary margin-right-auto-1" data-dismiss="modal"
						>Close</button>
					<button type="submit" form="form-2" class="btn btn-success" onclick="attachUser()">Save Changes to Case Workers Assigned to Case</button>
				</div>
			</div>
		</div>
        </div>
    )
}

export default AttachOrEditCaseWorkerModal;