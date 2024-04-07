import NavBar from 'components/ui/NavBar';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Task from "models/Task"
import "styles/views/MyTasks.scss";

const FormField = (props) => {
  return (
    <div className="mytasks field">
      {/* Task details */}
      <title className="mytasks split-wrapper">
      <label className="mytasks title">{props.task}</label>
      <div className="mytasks status-box">{props.status}</div>
      </title>
      <content className="mytasks split-wrapper">
      <left className="mytasks left-wrapper">
      <label className="mytasks label">{"Description"}</label>
      <label className="mytasks content">{props.desc}</label>
      </left>
      <right className="mytasks right-wrapper">
      <label className="mytasks label">{"Date"}</label>
      <label className="mytasks content">{props.date}</label>
      <label className="mytasks label">{"Duration"}</label>
      <label className="mytasks content">{`${props.dur/60} hrs`}</label>
      <label className="mytasks label">{"Compensation"}</label>
      <label className="mytasks content">{`${props.comp} coins`}</label>
      </right>
      </content>
    </div>
  );
};
FormField.propTypes = {
  task: PropTypes.string,
  desc: PropTypes.string,
  date: PropTypes.string,
  dur: PropTypes.int,
  comp: PropTypes.int,
  status: PropTypes.string,
};


const MyTasks = () => {
  const navigate = useNavigate();
  //const currentId = localStorage.getItem("UserId")
  const userId = 1
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Fetch tasks from an API or use any other method to retrieve data
    setTasks([
      { id: "1", title: "Gardening", description: "...", date:"a date", price: "10", address: "...", duration: "30", status:"Undone"},
      { id: "2", title: "Homework", description: "...", date:"a date", price: "15", address: "...", duration: "120", status:"Undone"},
    ]);


    async function fetchData() {
    try {
        const response = await api.get(`/tasks/created/${userId}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setTasks(response.data);
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


  }, []); // Empty dependency array to run the effect only once

  return (
        <>
          <NavBar />
          <div className="mytasks container">
            <h1 >My tasks</h1>
            <p>Here is an overview of all tasks you posted</p>

          {/* Wrap the tasks in a scrollable element*/}
          <tasks style={{height:650, overflow: "auto", width: 1000}}>
          {tasks.map((task: Task) => (
          <div className="mytasks form" key={task.id}>

            {/*Show all needed attributes for a task*/}
            <div className="task-wrapper">
              <FormField
                task={task.title}
                desc={task.description}
                date={task.date}
                dur={task.duration}
                comp={task.price}
                status={task.status}

              />
            </div>
            <div className="mytasks button-container">
              <Button
              style={{ marginRight: '40px' }}
              width="40%"
              >
              Delete task
              </Button>
              <Button
              width="40%"
              >
              Check out helpers
              </Button>
            </div>

          </div>
          ))}
          </tasks>

             <div className="mytasks button-container">
                <Button
                  style={{ marginRight: '10px' }}
                  width="100%"
                  onClick={() => navigate("/homefeed")}
                >
                  Back to homefeed
                </Button>
              </div>
          </div>
         </>
  );
};

export default MyTasks;
