import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Form,
  Input,
  Media,
  Progress,
  Table,
  Collapse,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

import { Capitalize } from "../../../../utilities/StringUtils";
import { dateTimeFormat } from "../../../../utilities/DateTimeUtil";
import { useSelector, useDispatch } from "react-redux";
import AvatarInitials from "../../../../avatarInitials/AvaterInitials";
import TextField from "../../../../components/textField/TextField";
import ToolTip from "../../../../components/toolTip/ToolTip";
import CommentServices from "../../../../../services/CommentSerives";
import { SuccessMessage } from "../../../../components/notification/NotificationHelper";

import { postskey, updateReplyByPost, addLike } from "../PostSlice";

export default function ChatTile({ post }) {
  const dispatch = useDispatch();
  const [showComments, setShowComments] = useState(false);
  const [reply, setreply] = useState("");
  const [replies, setReplies] = useState([]);

  const { repliesByPost } = useSelector((state) => {
    return state[postskey];
  });
  console.log(replies, " replies");
  useEffect(() => {
    setReplies(repliesByPost[post?.id]);
  }, [repliesByPost]);

  const topicwriterFirstName = post.firstname;
  const topicwriterlastName = post.lastname;
  const createdAt = post.created_at;

  const makeComment = async () => {
    let response = await CommentServices.addCommentTopost({
      postId: post.id,
      comment: reply,
    });
    console.log(" new commnet", response.data);

    dispatch(updateReplyByPost({ postId: [post.id], comment: response.data }));
    setreply("");
  };

  const toggleCollapse = (e) => {
    setShowComments(!showComments);
  };

  const addlike = async (payload) => {
    let response = await CommentServices.addLikeOnComment(payload);
    if (response?.status == 200) {
      console.log("success, like updated");
      SuccessMessage("Like Added");
    }
    // update happening from socket listener
    // dispatch(addLike({ postId:[post.id], replyId: payload.replyId} ))
  };

  return (
    <Row className="p-4">
      <Col>
        <Card>
          <CardHeader className="d-flex align-items-center  justify-content-between pt-2 mb-2 text-sm pb-2">
            <div className="d-flex align-items-center ">
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <AvatarInitials
                  firstName={topicwriterFirstName}
                  lastName={topicwriterlastName}
                />
              </a>
              <div className="mx-3">
                <a
                  className="text-dark font-weight-600 text-sm"
                  href="#pablo"
                  onClick={(e) => e.preventDefault()}
                >
                  {Capitalize(topicwriterFirstName) +
                    " " +
                    Capitalize(topicwriterlastName)}
                </a>
                <small className="d-block text-muted">
                  {dateTimeFormat(createdAt)}
                </small>
              </div>
            </div>
            <div className="pointer">
              {showComments ? (
                <FaAngleUp
                  className="text-xl clark-color"
                  onClick={toggleCollapse}
                />
              ) : (
                <FaAngleDown
                  className="text-xl clark-color"
                  onClick={toggleCollapse}
                />
              )}
            </div>
          </CardHeader>

          <CardBody className="pt-2 mb-2 pb-3">
            <p className="mb-3">{post.content}</p>

            <Collapse role="tabpanel" isOpen={showComments}>
              <hr className=" hr-less mt-0" />
              <div className="mb-1">
                {replies == undefined || replies.length == 0 ? (
                  <>
                    <p className="h-3"> No Responses yet!</p>
                  </>
                ) : (
                  <>
                    {replies?.map((reply) => (
                      <Media className="media-comment ml-4">
                        <AvatarInitials
                          firstName={reply.firstname}
                          lastName={reply.lastname}
                        />
                        <Media className="w-100">
                          <div className="media-comment-text ml-2">
                            <h6 className="h5 mt-0">
                              {Capitalize(reply.firstname) +
                                " " +
                                Capitalize(reply?.lastname)}{" "}
                              <small className="d-block text-muted">
                                {dateTimeFormat(reply?.created_at)}
                              </small>
                            </h6>
                            <p className="text-sm lh-160">{reply.content}</p>
                            <div className="icon-actions">
                              <a
                                className="like active"
                                href="#pablo"
                                onClick={(e) => {
                                  e.preventDefault();
                                  addlike({
                                    replyId: reply.id,
                                    likes: reply.likes,
                                  });
                                }}
                              >
                                <i className="fas fa-thumbs-up"></i>
                                <span className="text-muted">
                                  {reply?.likes} likes
                                </span>
                              </a>
                            </div>
                          </div>
                        </Media>
                      </Media>
                    ))}
                  </>
                )}

                <hr className=" hr-less" />
                <Media className="align-items-center">
                  <Media body>
                    <Form className="d-flex  ml-2">
                      <TextField
                        // label={"Email"}
                        placeholder="Write your comment"
                        rows="1"
                        formstyle={{ width: "100%" }}
                        type="textarea"
                        value={reply}
                        onChange={(e) => setreply(e.target.value)}
                        // errorMessage={validations.emailError}
                      />
                      {/* <ToolTip
                      id={post.id + "replybutton"}
                      infoText={
                        reply == ""
                          ? "Write comment to post"
                          : "Click to comment"
                      }
                    /> */}
                      <Button
                        color="clark-red"
                        className="btn-icon avatar-lg rounded-circle "
                        id={post.id + "replybutton"}
                        style={{
                          marginLeft: "0.8rem",
                        }}
                        onClick={reply != "" && makeComment}
                      >
                        <span className="btn-inner--icon">
                          <i
                            class="fas fa-chevron-right"
                            style={{
                              fontSize: "30px",
                            }}
                          ></i>
                        </span>
                      </Button>
                    </Form>
                  </Media>
                </Media>
              </div>
            </Collapse>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
}
