import { Button } from "components/ui/Button";
import NavBar from 'components/ui/NavBar';
import { api, handleError } from "helpers/api";
import User from "models/User";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "styles/views/MyProfile.scss";

const FormField = (props) => {
  return (
    <div className="myprofile field">
      <label className="myprofile label">{props.label}</label>
      <input
        className="myprofile input"
        type={"text"}
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};

const RadiusDropdown = (props) => {
  const handleChange = (event) => {
    props.onChange(parseInt(event.target.value));
  };
  return (
    <div className="myprofile field">
      <label className="myprofile label">{props.label}</label>
      <div className="myprofile dropdown-container">
        <select
          className="myprofile input"
          value={props.value !== null ? props.value : ''}
          onChange={handleChange}
          style={{width: '410px', color: props.value === null ? '#999999' : '#553842'}}
        >
          <option value="" disabled >{props.placeholder}</option>
          <option value="1">1 km</option>
          <option value="2">2 km</option>
          <option value="3">3 km</option>
          <option value="5">5 km</option>
          <option value="10">10 km</option>
          <option value="15">15 km</option>
          <option value="20">20 km</option>
          <option value="21">see all tasks</option>
        </select>
      </div>
    </div>
  );
};
RadiusDropdown.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string
};


const MyProfile = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("currentUserId");
  //const [currentUser, setCurrentUser] = useState<User>(null);
  // Once we are connected to the backend, use the actual current user
  //const currentUser = localStorage.getItem("currentUser")
  const xxx = new User({
    id: 1,
    name: "testname",
    username: "testusername",
    token: "some-token",
    status: "online"
  });
  const currentUser = localStorage.getItem("currentUser");

  // Define variables for the attributes that can be changed
  const [username, setUsername] = useState<string>(null);
  const [name, setName] = useState<string>(null);
  const [phonenumber, setPhonenumber] = useState<string>(null);
  const [address, setAddress] = useState<string>(null);
  const [radius, setRadius] = useState<int>(null);

  useEffect(() => {

    async function fetchData() {
    try {
        const response = await api.get(`/users/${currentUserId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentUser(response.data);
      } catch (error) {
        console.error(
          `Something went wrong while fetching the tasks: \n${handleError(
            error
          )}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the tasks! See the console for details."
        );
      }
    }
    //fetchData();

  });

  const doSaveUpdates = async () => {
    try {
      const requestBody = JSON.stringify({ username, name, phonenumber, address, radius});
      const response = await api.put(`/users/${currentUser.id}`, requestBody, {headers: {"Token": currentUser.token}});
      // Get the returned user and update a new object.
      const updatedUser = new User(response.data);

    } catch (error) {
      alert(
        `Your updates could not be saved: \n${handleError(error)}`
      );
    }
  };

  return (
        <>
          <NavBar />
          <div className="myprofile container">
            <h1 >{currentUser.username}{"'"}s profile</h1>
            <p>Here, you can edit your profile</p>
            <div className="myprofile form">

              {/*Define all needed attributes that can be changed by a user*/}
              <FormField
                label="Name"
                placeholder={currentUser.name}
                value={name}
                onChange={(n: string) => setName(n)}
              />
              <FormField
                label="Phone Number"
                placeholder={currentUser.phonenumber ? currentUser.phonenumber: "Add your phone number"}
                value={phonenumber}
                onChange={(pn: string) => setPhonenumber(pn)}
              />
              <FormField
                label="Address"
                placeholder={currentUser.address ? currentUser.address : "Add your location"}
                value={address}
                onChange={(a: string) => setAddress(a)}
              />
              <RadiusDropdown
                label="Radius in which to look for tasks"
                placeholder={currentUser.radius ? currentUser.radius : "Choose radius"}
                value={radius}
                onChange={(r: int) => setRadius(r)}
              />

              <div className="myprofile button-container">
                <Button
                  style={{ marginRight: '10px' }}
                  width="100%"
                  onClick={() => navigate("/homefeed")}
                >
                  Back to homefeed
                </Button>
                <Button
                  width="100%"
                  disabled={!name && !phonenumber && !address && !radius}
                  onClick={() => doSaveUpdates()}
                 >
                  Save changes
                </Button>
              </div>

            </div>
          </div>
         </>
  );
};

export default MyProfile;
