import React from "react";
import axios from "axios";

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      newUser: { id: "", name: "", surname: "", age: "" },
      isOpen: false,
    };
  }
  async componentDidMount() {
    axios.get("http://localhost:3003/users").then((response) => {
      const data = response.data;
      this.setState({ users: data });
    });
  }

  openModal = () => {
    this.setState({ isOpen: true });
  };
  closeModal = () => {
    this.setState({ isOpen: false });
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      newUser: { ...prevState.newUser, [name]: value },
    }));
  };

  addUser = () => {
    const { newUser } = this.state;
    if (newUser.name && newUser.surname && newUser.age) {
      axios
        .post("http://localhost:3003/users", newUser, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          this.setState((prevState) => ({
            users: [...prevState.users, data],
            newUser: { id: "", name: "", surname: "", age: "" },
            isOpen: false,
          }));
        });
    } else {
      alert("Xanalar bos ola bilmez!");
    }
  };

  deleteUser = async (id) => {
    await axios.delete(`http://localhost:3003/users/${id}`);
    const newUsers = this.state.users.filter((user) => user.id !== id);
    this.setState({ users: newUsers });
  };

  editUser = (id) => {
    const { users } = this.state;
    let edituser = users.find((user) => user.id === id);
    if (edituser) {
      this.setState({
        newUser: {
          id: edituser.id,
          name: edituser.name,
          surname: edituser.surname,
          age: edituser.age,
        },
        isOpen: true,
      });
    }
  };

  onUpdate = () => {
    const { users, newUser } = this.state;
    if (newUser.name && newUser.surname && newUser.age) {
      axios
        .put(`http://localhost:3003/users/${newUser.id}`, newUser, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          const updatedUsers = users.map((user) =>
            user.id === data.id ? data : user
          );
          this.setState({
            users: updatedUsers,
            newUser: { id: "", name: "", surname: "", age: "" },
            isOpen: false,
          });
        });
    } else {
      alert("Xanalar bos ola bilmes!");
    }
  };

  render() {
    const { users, newUser, isOpen } = this.state;
    return (
      <div className="datatable">
        <button onClick={this.openModal} className="btn btn-primary">
          Add User
        </button>
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Age</th>
              <th>Delete/Update</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{++index}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.age}</td>
                <td>
                  <button
                    onClick={() => this.deleteUser(user.id)}
                    className="btn btn-outline-danger me-2"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => this.editUser(user.id)}
                  >
                    <i className="fa-sharp fa-solid fa-pen"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isOpen && (
          <div className="my-modal">
            <button
              className="btn btn-secondary mb-2"
              onClick={this.closeModal}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control mb-3"
              value={newUser.name}
              onChange={this.handleInputChange}
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              className="form-control mb-3"
              value={newUser.surname}
              onChange={this.handleInputChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              className="form-control mb-3"
              value={newUser.age}
              onChange={this.handleInputChange}
            />
            {this.state.newUser.id ? (
              <button
                className="btn btn-outline-success"
                onClick={this.onUpdate}
              >
                Update
              </button>
            ) : (
              <button
                onClick={this.addUser}
                className="btn btn-outline-success"
              >
                Create User
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Table;
