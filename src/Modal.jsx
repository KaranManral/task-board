import React,{useState,useEffect} from "react";

export default function Modal(props) {
    const [title,setTitle] = useState(props.currentTask.title);
    const [description,setDescription] = useState(props.currentTask.description);
    const [team,setTeam] = useState(props.currentTask.team);
    const [assignee,setAssignee] = useState(props.currentTask.assignee);
    const [priority,setPriority] = useState(props.currentTask.priority);
    const [status,setStatus] = useState(props.currentTask.status);

    useEffect(()=>{
        //do something
        // console.log(title);
    });

    useEffect(()=>{
        setTitle(props.currentTask.title);
        setDescription(props.currentTask.description);
        setTeam(props.currentTask.team);
        setAssignee(props.currentTask.assignee);
        setPriority(props.currentTask.priority);
        setStatus(props.currentTask.status);
    },[props.currentTask])
  return (
    <div
      className="modal-fade hidden top-0 left-0 w-full h-full bg-black bg-opacity-50"
      id="modal-dialog"
    >
      <div className="modal w-80 max-sm:w-64 relative mx-auto top-1/4">
        <div className="header flex justify-between bg-white p-4">
          <p className="text-xl font-semibold capitalize">
            {props.type === "create"
              ? "Create A Task"
              : props.type === "edit"
              ? "Edit Task"
              : "Delete Task"}
          </p>
          <button
            type="button"
            onClick={() => {
              let modal = document.getElementById("modal-dialog");
              modal.classList.remove("fixed");
              modal.classList.add("hidden");
            }}
          >
            &#9447;
          </button>
        </div>
        <br />
        {props.type === "delete" ? (
          <div className="flex flex-col justify-evenly p-5">
            <p>Do you wish to delete task?</p>
            <br />
            <div className="flex justify-between items-center">
              <p className="font-bold">{props.currentTask.title}</p>
              <input
                type="button"
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-sm cursor-pointer"
                value="Yes"
                id="deleteTask"
                onClick={props.delete.bind(this)}
              />
              <input
                type="button"
                className="text-white bg-blue-500 hover:bg-blue-600 rounded-sm cursor-pointer"
                value="No"
                onClick={() => {
                  let modal = document.getElementById("modal-dialog");
                  modal.classList.remove("fixed");
                  modal.classList.add("hidden");
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-evenly p-5">
            <div className="flex justify-between items-center">
              <label htmlFor="tile">Title:</label>
              <input
                className="w-2/3"
                type="text"
                name="title"
                id="tile"
                value={title}
                onChange={(e)=>{setTitle(e.target.value)}}
                disabled={props.type === "edit" ? true : false}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="desc">Description:</label>
              {props.type === "create" ? (
                <input className="w-2/3" type="text" name="desc" id="desc" value={description}
                onChange={(e)=>{setDescription(e.target.value)}} />
              ) : (
                <textarea className="w-2/3" id="desc" value={description}
                 disabled></textarea>
              )}
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="team">Team:</label>
              <input
                className="w-2/3"
                type="text"
                name="team"
                id="team"
                value={team}
                onChange={(e)=>{setTeam(e.target.value)}}
                disabled={props.type === "edit" ? true : false}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="assign">Assignee:</label>
              <input
                className="w-2/3"
                type="text"
                name="assign"
                id="assign"
                value={assignee}
                onChange={(e)=>{setAssignee(e.target.value)}}
                disabled={props.type === "edit" ? true : false}
              />
            </div>
            <div className="flex justify-between items-center">
              <label htmlFor="prior">Priority:</label>
              <select name="prior" id="prior" value={priority}
                onChange={(e)=>{setPriority(e.target.value)}}>
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
              </select>
            </div>
            {props.type === "edit" ? (
              <div className="flex justify-between items-center">
                <label htmlFor="status">Status:</label>
                <select name="status" id="status" value={status}
                onChange={(e)=>{setStatus(e.target.value)}}>
                  <option value="assign">Assign</option>
                  <option value="progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="deployed">Deployed</option>
                  <option value="deffered">Deffered</option>
                </select>
              </div>
            ) : (
              ""
            )}
            <br />
            <input
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-600 rounded-sm cursor-pointer"
              id="submitTask"
              value={
                props.type === "create"
                  ? "Create Task"
                  : "Edit Task"
              }
              onClick={(e)=>{props.submit(e,title,description,team,assignee,priority,status)}}
            />
          </div>
        )}
      </div>
    </div>
  );
}
