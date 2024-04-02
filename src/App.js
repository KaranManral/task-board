import React, { useState, useEffect } from "react";
import "./App.css";
import Modal from "./Modal";

function App() {
  const [modalType, setModalType] = useState("");
  const [currentTask, setCurrentTask] = useState({
    id: "",
    title: "",
    description: "",
    team: "",
    assignee: "",
    priority: "P0",
    startDate: "",
    endDate: "",
    status: "",
  });
  const [taskList, setTaskList] = useState([]);
  const [pending, setPending] = useState([]);
  const [progress, setProgress] = useState([]);
  const [deployed, setDeployed] = useState([]);
  const [complete, setComplete] = useState([]);
  const [deffered, setDeffered] = useState([]);

  const [sortBy, setSortBy] = useState({ sort: "priority", order: "asc" });

  const [filters, setFilters] = useState({
    assignee: "",
    priority: "",
    fDate: "",
    toDate: "",
  });

  function SubmitTask(e, title, description, team, assignee, priority, status) {
    e.preventDefault();

    if (status === undefined || status === "" || modalType === "create") {
      if (title !== "") {
        if (description !== "") {
          if (team !== "") {
            if (assignee !== "") {
              let date = new Date();
              let task = {
                id: `${title.split(" ")[0]}_${Date.now()}`,
                title: title,
                description: description,
                team: team,
                assignee: assignee,
                priority: priority,
                startDate: date.toISOString().split("T")[0],
                endDate: "",
                status: "assign",
              };
              setTaskList((previousState) => {
                let modal = document.getElementById("modal-dialog");
                modal.classList.remove("fixed");
                modal.classList.add("hidden");
                alert("Task Created");
                return [...previousState, task];
              });
            } else alert("Missing Required Values");
          } else alert("Missing Required Values");
        } else alert("Missing Required Values");
      } else alert("Missing Required Values");
    } else {
      setTaskList((previousState) => {
        let [obj, index] = [null, -1];

        for (let i = 0; i < previousState.length; i++) {
          if (previousState[i].id === currentTask.id) {
            obj = previousState[i];
            index = i;
            break;
          }
        }

        if (obj === null && index === -1) {
          let modal = document.getElementById("modal-dialog");
          modal.classList.remove("fixed");
          modal.classList.add("hidden");
          alert("Edit Failed");
          return [...previousState];
        } else {
          let task = {
            id: obj.id,
            title: obj.title,
            description: obj.description,
            team: obj.team,
            assignee: obj.assignee,
            priority: priority,
            startDate: obj.startDate,
            endDate: "",
            status: status,
          };

          if (status === "completed") {
            let date = new Date();
            task["endDate"] = date.toISOString().split("T")[0];
          } else task["endDate"] = "";

          const newState = previousState.slice();
          newState.splice(index, 1, task);

          let modal = document.getElementById("modal-dialog");
          modal.classList.remove("fixed");
          modal.classList.add("hidden");

          return [...newState];
        }
      });
    }
  }

  function deleteTask(e) {
    e.preventDefault();
    let modal = document.getElementById("modal-dialog");
    modal.classList.remove("fixed");
    modal.classList.add("hidden");
    let id = currentTask.id;
    let index = taskList.findIndex((obj) => obj.id === id);

    const newTaskList = taskList.slice();
    newTaskList.splice(index, 1);
    setTaskList([...newTaskList]);
  }

  useEffect(() => {
    taskList.sort((a, b) => {
      if (sortBy.sort === "priority") {
        if (sortBy.order === "asc") return a.priority.localeCompare(b.priority);
        else return b.priority.localeCompare(a.priority);
      } else if (sortBy.sort === "sDate") {
        if (sortBy.order === "asc")
          return a.startDate.localeCompare(b.startDate);
        else return b.startDate.localeCompare(a.startDate);
      } else if (sortBy.sort === "eDate") {
        if (sortBy.order === "asc") return a.endDate.localeCompare(b.endDate);
        else return b.endDate.localeCompare(a.endDate);
      } else return a.priority.localeCompare(b.priority);
    });

    setPending([]);
    setProgress([]);
    setComplete([]);
    setDeployed([]);
    setDeffered([]);

    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].status === "assign")
        setPending((prevState) => [...prevState, taskList[i]]);
      else if (taskList[i].status === "progress")
        setProgress((prevState) => [...prevState, taskList[i]]);
      else if (taskList[i].status === "completed")
        setComplete((prevState) => [...prevState, taskList[i]]);
      else if (taskList[i].status === "deployed")
        setDeployed((prevState) => [...prevState, taskList[i]]);
      else if (taskList[i].status === "deffered")
        setDeffered((prevState) => [...prevState, taskList[i]]);
    }

    if (
      filters.assignee === "" &&
      filters.priority === "" &&
      filters.fDate === "" &&
      filters.toDate === ""
    )
      return;
    else {
      setPending((prevState) => {
        const newState = prevState.filter((item) => {
          return (
            (!filters.assignee || item.assignee.includes(filters.assignee)) &&
            (!filters.priority || item.priority === filters.priority) &&
            (!filters.fDate ||
              new Date(item.startDate) >= new Date(filters.fDate)) &&
            (!filters.toDate ||
              new Date(item.startDate) <= new Date(filters.toDate))
          );
        });
        return [...newState];
      });
      setProgress((prevState) => {
        const newState = prevState.filter((item) => {
          return (
            (!filters.assignee || item.assignee.includes(filters.assignee)) &&
            (!filters.priority || item.priority === filters.priority) &&
            (!filters.fDate ||
              new Date(item.startDate) >= new Date(filters.fDate)) &&
            (!filters.toDate ||
              new Date(item.startDate) <= new Date(filters.toDate))
          );
        });
        return [...newState];
      });
      setComplete((prevState) => {
        const newState = prevState.filter((item) => {
          return (
            (!filters.assignee || item.assignee.includes(filters.assignee)) &&
            (!filters.priority || item.priority === filters.priority) &&
            (!filters.fDate ||
              new Date(item.startDate) >= new Date(filters.fDate)) &&
            (!filters.toDate ||
              new Date(item.startDate) <= new Date(filters.toDate))
          );
        });
        return [...newState];
      });
      setDeployed((prevState) => {
        const newState = prevState.filter((item) => {
          return (
            (!filters.assignee || item.assignee.includes(filters.assignee)) &&
            (!filters.priority || item.priority === filters.priority) &&
            (!filters.fDate ||
              new Date(item.startDate) >= new Date(filters.fDate)) &&
            (!filters.toDate ||
              new Date(item.startDate) <= new Date(filters.toDate))
          );
        });
        return [...newState];
      });
      setDeffered((prevState) => {
        const newState = prevState.filter((item) => {
          return (
            (!filters.assignee || item.assignee.includes(filters.assignee)) &&
            (!filters.priority || item.priority === filters.priority) &&
            (!filters.fDate ||
              new Date(item.startDate) >= new Date(filters.fDate)) &&
            (!filters.toDate ||
              new Date(item.startDate) <= new Date(filters.toDate))
          );
        });
        return [...newState];
      });
    }
  }, [taskList, sortBy, filters]);

  useEffect(() => {});

  return (
    <div className="App">
      <Modal
        type={modalType}
        currentTask={currentTask}
        submit={SubmitTask}
        delete={deleteTask}
      />
      <fieldset className="container mx-auto py-5 px-16 border-2 rounded-md border-white">
        <legend className="text-3xl md:text-5xl text-start ml-8 font-bold">
          Task Board
        </legend>
        <div className="flex justify-between items-center flex-wrap">
          <p>Filter By: </p>
          <div className="flex w-4/5 justify-evenly items-center flex-wrap">
            <input
              type="text"
              name="name"
              id="name"
              className="max-sm:w-40"
              placeholder="Assignee Name"
              value={filters.assignee}
              onChange={(e) =>
                setFilters((prevState) => {
                  return {
                    assignee: e.target.value,
                    priority: prevState.priority,
                    fDate: prevState.fDate,
                    toDate: prevState.toDate,
                  };
                })
              }
            />
            <select
              name="priority"
              id="priority"
              value={filters.priority}
              onChange={(e) =>
                setFilters((prevState) => {
                  return {
                    assignee: prevState.assignee,
                    priority: e.target.value,
                    fDate: prevState.fDate,
                    toDate: prevState.toDate,
                  };
                })
              }
            >
              <option value="">Priority</option>
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
            </select>
            <div>
              <label htmlFor="fromDate">From</label>&emsp;
              <input
                type="date"
                name="fromDate"
                id="fromDate"
                value={filters.fDate}
                onChange={(e) =>
                  setFilters((prevState) => {
                    return {
                      assignee: prevState.assignee,
                      priority: prevState.priority,
                      fDate: e.target.value,
                      toDate: prevState.toDate,
                    };
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="toDate">To</label>&emsp;
              <input
                type="date"
                name="toDate"
                id="toDate"
                value={filters.toDate}
                onChange={(e) =>
                  setFilters((prevState) => {
                    return {
                      assignee: prevState.assignee,
                      priority: prevState.priority,
                      fDate: prevState.fDate,
                      toDate: e.target.value,
                    };
                  })
                }
              />
            </div>
          </div>
          <input
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 rounded-sm cursor-pointer"
            value="Add New Task"
            onClick={() => {
              setModalType("create");
              let modal = document.getElementById("modal-dialog");
              modal.classList.remove("hidden");
              modal.classList.add("fixed");
            }}
          />
        </div>
        <br />
        <br />
        <div className="flex justify-between flex-wrap">
          <div className="flex items-center">
            <p>Sort By: </p>&emsp;
            <select
              name="sortby"
              id="sortby"
              onChange={(e) =>
                setSortBy((prevState) => {
                  return { sort: e.target.value, order: prevState.order };
                })
              }
            >
              <option value="priority">Priority</option>
              <option value="sDate">Start Date</option>
              <option value="eDate">End Date</option>
            </select>
          </div>
          <div className="flex items-center">
            <p>Order: </p>&emsp;
            <select
              name="order"
              id="order"
              onChange={(e) =>
                setSortBy((prevState) => {
                  return { sort: prevState.sort, order: e.target.value };
                })
              }
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <br />
        <br />
        <div className="flex justify-evenly items-baseline flex-wrap">
          <div className="border border-gray-100 rounded-md min-w-64 mb-10">
            <p className="bg-gray-400 text-white rounded-t-md text-center">
              Pending
            </p>
            <div className="pending flex flex-col items-center justify-evenly p-3 bg-white h-full rounded-b-md">
              {pending.map((obj, i) => {
                return (
                  <div
                    className="p-2 mb-2 bg-gray-100 w-64 rounded-sm"
                    id={`PTask_${i}`}
                    key={`PTask_${i}`}
                  >
                    <div className="flex justify-between items-center border-b-2 py-1">
                      <p className="font-bold text-start ">{obj.title}</p>
                      <p className="bg-blue-600 text-white font-bold p-1">
                        {obj.priority}
                      </p>
                    </div>
                    <br />
                    <p className="text-start">{obj.description}</p>
                    <br />
                    <div className="flex justify-between items-center">
                      <p className="font-bold">@{obj.assignee}</p>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-1 px-3 font-bold"
                        data-dropdown-toggle="dropdownSkidding"
                        data-dropdown-offset-distance="10"
                        data-dropdown-offset-skidding="100"
                        data-dropdown-placement="right"
                        id={`PoptBtn${i}`}
                        onClick={() => {
                          let dropdown = document.getElementById(
                            `PdropdownSkidding${i}`
                          );
                          dropdown.classList.toggle("hidden");
                          dropdown.classList.toggle("absolute");
                          window.addEventListener("click", function (event) {
                            if (!event.target.matches(`#PoptBtn${i}`)) {
                              // Check if the click was outside the dropdown content
                              if (!dropdown.contains(event.target)) {
                                // Close the dropdown
                                dropdown.classList.add("hidden");
                                dropdown.classList.remove("absolute");
                              }
                            }
                          });
                        }}
                      >
                        &#8942;
                      </button>
                    </div>
                    <div
                      id={`PdropdownSkidding${i}`}
                      className="z-10 ml-16 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault"
                      >
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(pending[i]);
                              setModalType("edit");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `PdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(pending[i]);
                              setModalType("delete");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `PdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <br />
                    <input
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-sm "
                      value={"Assign"}
                      disabled
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border border-gray-100 rounded-md min-w-64 mb-10">
            <p className="bg-orange-400 text-white rounded-t-md text-center">
              In Progress
            </p>
            <div className="progress flex flex-col justify-evenly items-center p-3 bg-white h-full rounded-b-md">
              {progress.map((obj, i) => {
                return (
                  <div
                    className="p-2 mb-2 bg-gray-100 w-64 rounded-sm"
                    id={`IPTask_${i}`}
                    key={`IPTask_${i}`}
                  >
                    <div className="flex justify-between items-center border-b-2 py-1">
                      <p className="font-bold text-start ">{obj.title}</p>
                      <p className="bg-blue-600 text-white font-bold p-1">
                        {obj.priority}
                      </p>
                    </div>
                    <br />
                    <p className="text-start">{obj.description}</p>
                    <br />
                    <div className="flex justify-between items-center">
                      <p className="font-bold">@{obj.assignee}</p>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-1 px-3 font-bold"
                        data-dropdown-toggle="dropdownSkidding"
                        data-dropdown-offset-distance="10"
                        data-dropdown-offset-skidding="100"
                        data-dropdown-placement="right"
                        id={`IPoptBtn${i}`}
                        onClick={() => {
                          let dropdown = document.getElementById(
                            `IPdropdownSkidding${i}`
                          );
                          dropdown.classList.toggle("hidden");
                          dropdown.classList.toggle("absolute");
                          window.addEventListener("click", function (event) {
                            if (!event.target.matches(`#IPoptBtn${i}`)) {
                              // Check if the click was outside the dropdown content
                              if (!dropdown.contains(event.target)) {
                                // Close the dropdown
                                dropdown.classList.add("hidden");
                                dropdown.classList.remove("absolute");
                              }
                            }
                          });
                        }}
                      >
                        &#8942;
                      </button>
                    </div>
                    <div
                      id={`IPdropdownSkidding${i}`}
                      className="z-10 ml-16 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault"
                      >
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(progress[i]);
                              setModalType("edit");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `IPdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(progress[i]);
                              setModalType("delete");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `IPdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <br />
                    <input
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-sm "
                      value={"In Progress"}
                      disabled
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border border-gray-100 rounded-md min-w-64 mb-10">
            <p className="bg-green-600 text-white rounded-t-md text-center">
              Completed
            </p>
            <div className="complete flex flex-col justify-evenly items-center p-3 bg-white h-full rounded-b-md">
              {complete.map((obj, i) => {
                return (
                  <div
                    className="p-2 mb-2 bg-gray-100 w-64 rounded-sm"
                    id={`CTask_${i}`}
                    key={`CTask_${i}`}
                  >
                    <div className="flex justify-between items-center border-b-2 py-1">
                      <p className="font-bold text-start ">{obj.title}</p>
                      <p className="bg-blue-600 text-white font-bold p-1">
                        {obj.priority}
                      </p>
                    </div>
                    <br />
                    <p className="text-start">{obj.description}</p>
                    <br />
                    <div className="flex justify-between items-center">
                      <p className="font-bold">@{obj.assignee}</p>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-1 px-3 font-bold"
                        data-dropdown-toggle="dropdownSkidding"
                        data-dropdown-offset-distance="10"
                        data-dropdown-offset-skidding="100"
                        data-dropdown-placement="right"
                        id={`CoptBtn${i}`}
                        onClick={() => {
                          let dropdown = document.getElementById(
                            `CdropdownSkidding${i}`
                          );
                          dropdown.classList.toggle("hidden");
                          dropdown.classList.toggle("absolute");
                          window.addEventListener("click", function (event) {
                            if (!event.target.matches(`#CoptBtn${i}`)) {
                              // Check if the click was outside the dropdown content
                              if (!dropdown.contains(event.target)) {
                                // Close the dropdown
                                dropdown.classList.add("hidden");
                                dropdown.classList.remove("absolute");
                              }
                            }
                          });
                        }}
                      >
                        &#8942;
                      </button>
                    </div>
                    <div
                      id={`CdropdownSkidding${i}`}
                      className="z-10 ml-16 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault"
                      >
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(complete[i]);
                              setModalType("edit");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `CdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(complete[i]);
                              setModalType("delete");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `CdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <br />
                    <input
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-sm "
                      value={"Completed"}
                      disabled
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border border-gray-100 rounded-md min-w-64 mb-10">
            <p className="bg-blue-950 text-white rounded-t-md text-center">
              Deployed
            </p>
            <div className="deployed flex flex-col justify-evenly items-center p-3 bg-white h-full rounded-b-md">
              {deployed.map((obj, i) => {
                return (
                  <div
                    className="p-2 mb-2 bg-gray-100 w-64 rounded-sm"
                    id={`DPTask_${i}`}
                    key={`DPTask_${i}`}
                  >
                    <div className="flex justify-between items-center border-b-2 py-1">
                      <p className="font-bold text-start ">{obj.title}</p>
                      <p className="bg-blue-600 text-white font-bold p-1">
                        {obj.priority}
                      </p>
                    </div>
                    <br />
                    <p className="text-start">{obj.description}</p>
                    <br />
                    <div className="flex justify-between items-center">
                      <p className="font-bold">@{obj.assignee}</p>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-1 px-3 font-bold"
                        data-dropdown-toggle="dropdownSkidding"
                        data-dropdown-offset-distance="10"
                        data-dropdown-offset-skidding="100"
                        data-dropdown-placement="right"
                        id={`DPoptBtn${i}`}
                        onClick={() => {
                          let dropdown = document.getElementById(
                            `DPdropdownSkidding${i}`
                          );
                          dropdown.classList.toggle("hidden");
                          dropdown.classList.toggle("absolute");
                          window.addEventListener("click", function (event) {
                            if (!event.target.matches(`#DPoptBtn${i}`)) {
                              // Check if the click was outside the dropdown content
                              if (!dropdown.contains(event.target)) {
                                // Close the dropdown
                                dropdown.classList.add("hidden");
                                dropdown.classList.remove("absolute");
                              }
                            }
                          });
                        }}
                      >
                        &#8942;
                      </button>
                    </div>
                    <div
                      id={`DPdropdownSkidding${i}`}
                      className="z-10 ml-16 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault"
                      >
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(deployed[i]);
                              setModalType("edit");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `DPdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(deployed[i]);
                              setModalType("delete");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `DPdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <br />
                    <input
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-sm "
                      value={"Deployed"}
                      disabled
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="border border-gray-100 rounded-md min-w-64 mb-10">
            <p className="bg-pink-400 text-white rounded-t-md text-center">
              Deffered
            </p>
            <div className="deffered flex flex-col justify-evenly items-center p-3 bg-white h-full rounded-b-md">
              {deffered.map((obj, i) => {
                return (
                  <div
                    className="p-2 mb-2 bg-gray-100 w-64 rounded-sm"
                    id={`DTask_${i}`}
                    key={`DTask_${i}`}
                  >
                    <div className="flex justify-between items-center border-b-2 py-1">
                      <p className="font-bold text-start ">{obj.title}</p>
                      <p className="bg-blue-600 text-white font-bold p-1">
                        {obj.priority}
                      </p>
                    </div>
                    <br />
                    <p className="text-start">{obj.description}</p>
                    <br />
                    <div className="flex justify-between items-center">
                      <p className="font-bold">@{obj.assignee}</p>
                      <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white py-1 px-3 font-bold"
                        data-dropdown-toggle="dropdownSkidding"
                        data-dropdown-offset-distance="10"
                        data-dropdown-offset-skidding="100"
                        data-dropdown-placement="right"
                        id={`DoptBtn${i}`}
                        onClick={() => {
                          let dropdown = document.getElementById(
                            `DdropdownSkidding${i}`
                          );
                          dropdown.classList.toggle("hidden");
                          dropdown.classList.toggle("absolute");
                          window.addEventListener("click", function (event) {
                            if (!event.target.matches(`#DoptBtn${i}`)) {
                              // Check if the click was outside the dropdown content
                              if (!dropdown.contains(event.target)) {
                                // Close the dropdown
                                dropdown.classList.add("hidden");
                                dropdown.classList.remove("absolute");
                              }
                            }
                          });
                        }}
                      >
                        &#8942;
                      </button>
                    </div>
                    <div
                      id={`DdropdownSkidding${i}`}
                      className="z-10 ml-16 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
                    >
                      <ul
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefault"
                      >
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(deffered[i]);
                              setModalType("edit");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `DdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Edit
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setCurrentTask(deffered[i]);
                              setModalType("delete");
                              let modal =
                                document.getElementById("modal-dialog");
                              let dropdown = document.getElementById(
                                `DdropdownSkidding${i}`
                              );
                              modal.classList.remove("hidden");
                              modal.classList.add("fixed");
                              dropdown.classList.add("hidden");
                              dropdown.classList.remove("absolute");
                            }}
                          >
                            Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                    <br />
                    <input
                      type="button"
                      className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-sm "
                      value={"Deffered"}
                      disabled
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
}

export default App;
