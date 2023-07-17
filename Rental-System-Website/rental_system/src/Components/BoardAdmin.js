import React, { useState, useEffect } from "react";

import UserService from "../Services/user.service";
import EventBus from "../common/EventBus";

const BoardAdmin = () => {
  const [content, setContent] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const [id, setID] = useState("");

  // useEffect(() => {
  //   UserService.getAdminBoard().then(
  //     (response) => {
  //       setContent(response.data);
  //     },
  //     (error) => {
  //       const _content =
  //         (error.response &&
  //           error.response.data &&
  //           error.response.data.message) ||
  //         error.message ||
  //         error.toString();

  //       setContent(_content);

  //       if (error.response && error.response.status === 401) {
  //         EventBus.dispatch("logout");
  //       }
  //     }
  //   );
  // }, []);

  const handleEditClick = (id) => {
    fetch(`http://localhost:5000/api/test/getuser/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.username);
        setEmail(data.email);
      })
      .catch((error) => console.error("Error:", error));
  };
  const handleroleClick = (id, role) => {
    console.log(role);
    fetch(`http://localhost:5000/api/test/changeuserrole/${id}/${role}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Successfully Updated");
        fetchSpaceDetails();
      })
      .catch((error) => console.error("Error:", error));
  };
  const handledeleteClick = (id) => {
    fetch(`http://localhost:5000/api/test/deleteuser/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Deleted Successfully");
        fetchSpaceDetails();
      })
      .catch((error) => console.error("Error:", error));
  };

  const editdetails = (id) => {
    const editdata = {
      username: username,
      email: email,
      password: password,
    };
    fetch(`http://localhost:5000/api/test/updateuser/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editdata),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Updated Successfully");
        fetchSpaceDetails();
      })
      .catch((error) => console.error("Error:", error));
  };

  const fetchSpaceDetails = async () => {
    fetch("http://localhost:5000/api/test/getallusers")
      .then((response) => response.json())
      .then((data) => {
        setContent(data);
        console.log(data);
      })
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchSpaceDetails();
  }, []);

  return (
    <div className="container">
      <h1>Admin Panel</h1>
      <br />
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Email</th>
            <th scope="col">Role</th>
            <th scope="col">Change Role</th>
            <th scope="col">Delete Profile</th>
            <th scope="col">Edit Profile</th>
          </tr>
        </thead>
        <tbody>
          {content.map((content) => (
            <tr key={content.id}>
              <th scope="row">{content.id}</th>
              <td>{content.username}</td>
              <td>{content.email}</td>
              <td>{content.roles.name}</td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    handleroleClick(
                      content.id,
                      content.roles[0].name === "user" ? "admin" : "user"
                    );
                  }}
                >
                  {content.roles[0].name === "user"
                    ? "Make Admin"
                    : "Make User"}
                </button>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handledeleteClick(content.id);
                  }}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  data-toggle="modal"
                  data-target="#editModal"
                  onClick={() => {
                    handleEditClick(content.id);
                    setID(content.id);
                  }}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Profile</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="Username">Username:</label>
                <input
                  type="text"
                  id="Username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Email">Email:</label>
                <input
                  type="text"
                  id="Email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="Password">Password:</label>
                <input
                  type="text"
                  id="Password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  editdetails(id);
                }}
                data-dismiss="modal"
              >
                Confirm Edit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardAdmin;
