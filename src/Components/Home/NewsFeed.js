import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCaseId, getClientId, standardFormatDate } from "../../Utils/helper";

const NewsFeed = () => {
  const origin = process.env.REACT_APP_BACKEND_URL;
  const caseId = getCaseId();
  const clientId = getClientId();
  const token = localStorage.getItem("token");
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(origin + `/api/home/posts/`, {
        headers: {
          Authorization: token,
        },
        params: {
          client_id: clientId,
          case_id: caseId,
        },
      });
      // Set the state with the fetched timeline data, ensure it's an array
      setPosts(Array.isArray(response.data) ? response.data : []);
    } catch (e) {
      console.error(e);
      setPosts([]); // Ensure posts is an array even on error
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <div className="content-left order-1 overflow-hidden">
        <div className="newsfeed has-tint-rows has-tint-top-21 has-tint-h-70 mt-0 h-100">
          <div className="background-main-10 height-25 has-sticky-header">
            <h4 className="client-contact-title text-center height-25 d-flex justify-content-center align-items-center h-100">
              newsfeed
            </h4>
          </div>
          {/* Check if posts array has data */}
          {posts.length > 0 ? (
            posts.map((post, index) => {
              return (
                <div
                  key={index}
                  className="post d-flex w-100 p-t-5 p-r-5 p-b-5 p-l-5"
                >
                  <div className="post-media">
                    <span className="border"></span>
                    <div className="ic ic-avatar ic-29 has-avatar-icon has-cover-img bg-white">
                      {post?.for_user?.bp_userprofile?.account_type ==
                      "Attorney" ? (
                        post?.for_user?.bp_userprofile?.bp_attorney_userprofile
                          ?.profile_pic ? (
                          <img
                            src={
                              post?.for_user?.bp_userprofile
                                ?.bp_attorney_userprofile?.profile_pic.url
                            }
                            className="h-100 w-100"
                          />
                        ) : (
                          <img
                            src="{% static 'bp_assets/img/avatar_new.svg' %}"
                            alt="Elizabeth"
                            className="h-100 w-100"
                          />
                        )
                      ) : post?.for_user?.bp_attorneystaff_userprofile
                          ?.profile_pic_29p ? (
                        <img
                          src={
                            post.for_user.bp_attorneystaff_userprofile
                              .profile_pic_29p.url
                          }
                          className="h-100 w-100"
                        />
                      ) : (
                        <img
                          src="{% static 'bp_assets/img/avatar_new.svg' %}"
                          alt="Elizabeth"
                          className="h-100 w-100"
                        />
                      )}
                    </div>
                  </div>
                  <div className="post-content d-flex-1 ml-2">
                    <div className="post-title-date d-flex align-items-center p-t-5 m-b-5">
                      <h2>
                        {post?.for_user?.first_name} {post?.for_user?.last_name}
                      </h2>
                      <span className="post-date text-grey">
                        {standardFormatDate(post?.created_at)}
                      </span>
                    </div>
                    <p>{post?.post}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div></div> // Fallback if no posts are found
          )}
        </div>
      </div>
    </>
  );
};

export default NewsFeed;
