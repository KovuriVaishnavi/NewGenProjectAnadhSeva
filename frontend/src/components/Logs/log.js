import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/logs.css";

const Log = () => {
  const [requests, setRequests] = useState([]);
  const [type, setType] = useState("donor"); // Default to 'donor'

  useEffect(() => {
    fetchRequests();
  }, [type]); // Add 'type' as a dependency

  const fetchRequests = async () => {
    let endpoint;
    switch (type) {
      case "donor":
        endpoint = "http://localhost:9004/api/request/donated";
        break;
      case "receiver":
        endpoint = "http://localhost:9004/api/request/received";
        break;
      case "volunteer":
        endpoint = "http://localhost:9004/api/request/volunteered";
        break;
      default:
        endpoint = "http://localhost:9004/api/request/donated";
        break;
    }

    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const logHistory = () => {
    console.log("History of requests:", requests);
  };

  const updateStatus = async (id, message) => {
    try {
      // Optimistically update the request's message and status
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === id
            ? { ...request, message: message, status: "completed" }
            : request
        )
      );

      // Make the API request to update the status
      await axios.put(
        "http://localhost:9004/api/request/" + id,
        {
          message: message,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
    } catch (error) {
      console.error("Error updating status of request:", error);
      // Optionally, revert optimistic update on error
      fetchRequests();
    }
  };

  return (
    <div>
      <h1>Log History</h1>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="donor">Donor</option>
        <option value="receiver">Receiver</option>
        <option value="volunteer">Volunteer</option>
      </select>

      <div className="logs">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              {type === "donor" && <th>Receiver Name</th>}
              {type === "volunteer" && (
                <>
                  <th>Donor Name</th>
                  <th>Donor Email</th>
                  <th>Receiver Name</th>
                  <th>Receiver Email</th>
                </>
              )}
              <th>Status</th>
              {type === "volunteer" ? <></> : <th>Message</th>}
              {type === "receiver" ? <th>Submission</th> : <></>}
            </tr>
          </thead>
          <tbody>
            {requests.map((request, index) => (
              <tr key={request._id}>
                <td>{index + 1}</td>
                <td>{request.createdAt.split("T")[0]}</td>
                {type === "donor" && <td>{request.receiverName}</td>}
                {type === "volunteer" && (
                  <>
                    <td>{request.donarName}</td>
                    <td>{request.donarEmail}</td>
                    <td>{request.receiverName}</td>
                    <td>{request.receiverEmail}</td>
                  </>
                )}
                <td>{request.status}</td>
                {type !== "volunteer" && (
                  <>
                    {type === "receiver" ? (
                      <>
                        <td>
                          {request.status !== "completed" ? (
                            <input
                              type="text"
                              className="message"
                              placeholder="Thank you message"
                            />
                          ) : (
                            <div>
                              <i>Your Msg:</i> {request.message}
                            </div>
                          )}
                        </td>
                        <td>
                          {request.status !== "completed" ? (
                            <button
                              onClick={() =>
                                updateStatus(
                                  request._id,
                                  document.querySelector(".message").value
                                )
                              }
                            >
                              Received
                            </button>
                          ) : (
                            <>--</>
                          )}
                        </td>
                      </>
                    ) : (
                      <td>{request.message}</td>
                    )}
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Log;
