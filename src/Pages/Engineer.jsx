import { useState } from "react";
import MaterialTable from "@material-table/core";
import Sidebar from "../Component/SIdeBar";
import Loader from "../Component/loder";
import StatusRow from "../Component/statusRow";
import useTickets from "../hooks/useTickets";
import useAuth from "../hooks/useAuth";
import WelcomeMsg from "../Component/Welcomemsg";
import UpdateTicketModal from "../Component/UpdateTicketModal";

const Enginner = () => {
  const [showModal, setShowModal] = useState(false);
  const [ticketDetail, setTicketDetail] = useState({});
  useAuth();
  const [isLoading, ticketList, setTicketList] = useTickets();

  const handdleRowClick = (event, rowData) => {
    setShowModal(true);
    setTicketDetail(rowData);
  };
  const changeTicketDetails = (event) => {
    setTicketDetail({
      ...ticketDetail,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <div className="row bg-light ">
        <Sidebar unfoldable={true} />
        <div className="col my-4">
          <div className="container">
            <div>
              <WelcomeMsg
                name={localStorage.getItem("name")}
                userType="engineer"
              />
              <StatusRow ticketList={ticketList} />
              <hr />
              {isLoading ? (
                <Loader />
              ) : (
                <MaterialTable
                  onRowClick={handdleRowClick}
                  title="Ticket assigned to me "
                  data={ticketList}
                  columns={[
                    { title: "Track id ", field: "_id" },
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
                      title: "TicketPriority",
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
              <UpdateTicketModal
                showModal={showModal}
                setShowModal={setShowModal}
                ticketDetail={ticketDetail}
                changeTicketDetails={changeTicketDetails}
                ticketList={ticketList}
                setTicketList={setTicketList}
                statusOptions={["OPEN", "CLOSED", "IN_PROGRESS", "BLOCKED"]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Enginner;
