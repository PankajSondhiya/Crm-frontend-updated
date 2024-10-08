import { useEffect, useState } from "react";
import axios from "axios";
import MaterialTable from "@material-table/core";
import { Button, Form, Modal, ModalBody, ModalFooter } from "react-bootstrap";
import Sidebar from "../Component/SIdeBar";
import Loader from "../Component/loder";
import { BASE_URL } from "../Constans";
import StatusRow from "../Component/statusRow";
import useAuth from "../hooks/useAuth";
import { toast } from "react-toastify";
import WelcomeMsg from "../Component/Welcomemsg";
import { AxiosInstance } from "../AxiosInstance/AxiosInstance";

const Admin = () => {
  const [userList, SetusersList] = useState([]);
  const [isUserListLoading, setIsUserslistLoading] = useState(false);
  const [showUserModal, SetshowUserModal] = useState(false);
  const [userDetail, setUserDetail] = useState({});
  const [ticketList, setTicketList] = useState([]);
  const [loading, setLoading] = useState(false);
  useAuth();

  const FetchUsers = async () => {
    try {
      setIsUserslistLoading(true);
      const { data } = await AxiosInstance.get("/crm/api/v1/users/");
      SetusersList(data);
    } catch (ex) {
      toast.error("Error occured while fetching the list of users.");
    } finally {
      setIsUserslistLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data } = await AxiosInstance.get(`/crm/api/v1/tickets/`);
      setTicketList(data);
    } catch (ex) {
      toast.error("Error occured while fetching the ticket counts.");
    }
  };

  const updateUserDetail = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await AxiosInstance.put(
        `/crm/api/v1/users/${userDetail.userId}`,
        {
          userType: userDetail.userType,
          userStatus: userDetail.userStatus,
          name: userDetail.name,
          email: userDetail.email,
          firebaseUid: userDetail.firebaseUid,
        }
      );

      toast.success("User detail updated successfully");
      window.location.reload();
      setLoading(false);
      SetshowUserModal(false);
    } catch (ex) {
      SetshowUserModal(false);
      toast.error(
        "Error occured while updating user details. Please try again in a minute."
      );
    }
  };

  const handdleRowClick = (event, rowData) => {
    SetshowUserModal(true);
    setUserDetail({
      name: rowData.name,
      userId: rowData._id,
      email: rowData.email,
      userStatus: rowData.userStatus,
      userType: rowData.userType,
      firebaseUid: rowData.firebaseUid,
    });
  };
  const changeUsersDetail = (event) => {
    setUserDetail({
      ...userDetail,
      [event.target.name]: event.target.value,
    });
  };
  useEffect(() => {
    FetchUsers();
    // fetchTickets();
  }, []);

  return (
    <>
      <div className="row bg-light ">
        <Sidebar />
        <div className="col my-4">
          <div className="container">
            <div>
              <WelcomeMsg
                name={localStorage.getItem("name")}
                userType="admin"
              />
              <StatusRow ticketList={ticketList} />
              <hr />
              {isUserListLoading ? (
                <Loader />
              ) : (
                <MaterialTable
                  onRowClick={handdleRowClick}
                  title="USER RECORDS"
                  data={userList}
                  columns={[
                    { title: "User ID", field: "userId" },
                    {
                      title: "Name",
                      field: "name",
                    },
                    {
                      title: "Email",
                      field: "email",
                    },
                    {
                      title: "Role",
                      field: "userType",
                    },
                    {
                      title: "Status",
                      field: "userStatus",
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showUserModal}
        onHide={() => SetshowUserModal(false)}
        centered
        backdrop="static"
        keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit User Details</Modal.Title>
        </Modal.Header>
        <ModalBody>
          <form>
            <h5 className="card-subtitle mb-2 text-primary lead">
              User ID: {userDetail.userId}
            </h5>
            <hr />
            <div className="input-group mb-3">
              <span className="input-group-text">Name</span>
              <input
                type="text"
                className="form-control"
                name="name"
                value={userDetail.name}
                onChange={changeUsersDetail}
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Email</span>
              <input
                type="text"
                className="form-control"
                name="email"
                value={userDetail.email}
                onChange={changeUsersDetail}
              />
            </div>

            <div className="input-group mb-3">
              <span className="input-group-text">Type</span>
              <Form.Select
                aria-label="User Type Selection"
                value={userDetail.userType}
                onChange={changeUsersDetail}
                name="userType"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="ENGINEER">ENGINEER</option>
                <option value="ADMIN">ADMIN</option>
              </Form.Select>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text">Status</span>
              <Form.Select
                aria-label="User Status Selection"
                value={userDetail.userStatus}
                onChange={changeUsersDetail}
                name="userStatus"
              >
                <option value="APPROVED">APPROVED</option>
                {/* <option value="REJECTED">REJECTED</option> */}
                <option value="PENDING">PENDING</option>
              </Form.Select>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => SetshowUserModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={updateUserDetail}
            disabled={loading}
          >
            {loading ? <Loader /> : "Update"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Admin;
