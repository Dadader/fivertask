import React, { useState, useEffect } from "react";

import UserService from "../Services/user.service";
import EventBus from "../common/EventBus";

const BoardAdmin = () => {
  const [content, setContent] = useState("");

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
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>MArk@yahoo.com</td>
            <td>User</td>
            <td>
              <button className="btn btn-success" disabled>
                Make Admin
              </button>
            </td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>
              <button className="btn btn-success" disabled>
                Make Admin
              </button>
            </td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>@twitter</td>
            <td>Thornton</td>
            <td>
              <button className="btn btn-success" disabled>
                Make Admin
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default BoardAdmin;
