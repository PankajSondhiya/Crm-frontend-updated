import axios from "axios";
import MaterialTable from "@material-table/core";
import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { BASE_URL } from "../Constans";
import Sidebar from "../Component/SIdeBar";
//import StatusCard from "../components/StatusCard";
//import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
//import StatusCard from "../Component/StatusCard";
import Loader from "../Component/loder";
import StatusRow from "../Component/statusRow";
import UpdateTicketDetail from "../Component/UpdateTicketModal";
import useTickets from "../hooks/useTickets";
import useAuth from "../hooks/useAuth";
import WelcomeMsg from "../Component/Welcomemsg";
import { AxiosInstance } from "../AxiosInstance/AxiosInstance";

const Customer = () => {
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [ticketCreationData, setTicketCreationData] = useState({});
  const [isLoading, ticketList, setTicketList, setIsLoading] = useTickets();
  const [showModal, setShowModal] = useState(false);
  const [ticketDetail, setTicketDetail] = useState({});

  useAuth();

  const closeCreateTicketModal = () => setShowCreateTicketModal(false);

  const createTicket = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const data = {
      userId: localStorage.getItem("userid"),
      title: ticketCreationData.title,
      description: ticketCreationData.description,
    };

    try {
      await AxiosInstance.post(`/crm/api/v1/tickets`, data);

      toast.success("Created a new ticket!");
      setShowCreateTicketModal(false);
      setTicketCreationData({});
      setIsLoading(false);
    } catch (ex) {
      setIsLoading(false);
      toast.error("Error while creating a new ticket!");
    }
  };

  const handleRowClick = (event, rowData) => {
    setShowModal(true);
    setTicketDetail(rowData);
  };
  const changeTicketDetails = (event) => {
    setTicketDetail({
      ...ticketDetail,
      [event.target.name]: event.target.value,
    });
  };

  const handleTicketCreateFormChange = (event) => {
    console.log(event);
    setTicketCreationData({
      ...ticketCreationData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <div className="row bg-light">
        <Sidebar />
        <div className="col my-4 ">
          <div className="container">
            <div>
              <WelcomeMsg
                name={localStorage.getItem("name")}
                userType={"user"}
              />

              <StatusRow ticketList={ticketList} />
              <hr />
              {isLoading ? (
                <Loader />
              ) : (
                <MaterialTable
                  onRowClick={handleRowClick}
                  title="Tickets created by me"
                  data={ticketList}
                  actions={[
                    {
                      icon: () => <i class="bi bi-plus-circle"></i>,
                      tooltip: "Create a new ticket",
                      isFreeAction: true,
                      onClick: () => setShowCreateTicketModal(true),
                    },
                  ]}
                  columns={[
                    { title: "Ticket ID", field: "_id" },
                    {
                      title: "Title",
                      field: "title",
                    },
                    {
                      title: "Description",
                      field: "description",
                    },
                    {
                      title: "Reporter",
                      field: "reporter",
                    },
                    {
                      title: "Priority",
                      field: "ticketPriority",
                    },
                    {
                      title: "Assignee",
                      field: "assignee",
                    },
                    {
                      title: "Status",
                      field: "status",
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={showCreateTicketModal}
        onHide={closeCreateTicketModal}
        centered
        backdrop="static"
        keyboard
      >
        <ModalHeader closeButton>
          <ModalTitle>Create Ticket</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={createTicket}>
            <div className="p-1">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  placeholder="Title"
                  value={ticketCreationData.title}
                  onChange={handleTicketCreateFormChange}
                  required
                />
              </div>
            </div>
            <div className="p-1">
              <div className="input-group">
                <textarea
                  type="text"
                  className="form-control md-textarea"
                  rows={3}
                  name="description"
                  placeholder="Description"
                  value={ticketCreationData.description}
                  onChange={handleTicketCreateFormChange}
                  required
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="secondary"
            onClick={() => setShowCreateTicketModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={createTicket} disabled={isLoading}>
            {isLoading ? <Loader /> : "Create"}
          </Button>
        </ModalFooter>
      </Modal>
      <UpdateTicketDetail
        showModal={showModal}
        setShowModal={setShowModal}
        ticketDetail={ticketDetail}
        changeTicketDetails={changeTicketDetails}
        ticketList={ticketList}
        setTicketList={setTicketList}
        statusOptions={["OPEN", "CLOSED"]}
      />
    </>
  );
};
export default Customer;
