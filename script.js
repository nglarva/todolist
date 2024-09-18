

const taskName = document.getElementById("task");
const descrip = document.getElementById("description");
const deadline = document.getElementById("deadline");
const dokho = document.getElementById("diff");
const taskCards = document.getElementById("tasks-cards");
const tasksDropdownList = document.getElementById("tasks");

const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const descriptInput = document.getElementById("description-input");
const diffInput = document.querySelectorAll('input[name="diff"]');
const dateInput = document.getElementById("date-input");


const date = new Date(Date.now())

console.log(typeof (date.getDate()))
const myCurrentTask = {
  id: 1223,
  name: "Dọn nhà",
  description: "Lau nhà, quét nhà, dọn nhà vệ sinh",
  diff: 1,
  isDone: true,
  deadline: {
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  },
  tasks: []    
};

let currentTask = {}
Object.freeze(myCurrentTask);
let { name, description, diff, tasks } = myCurrentTask;
tasks = JSON.parse(localStorage.getItem("data")) || [];
// const result = tasks.filter((task) => task.isDone == false);
// console.log(result);
const { day } = myCurrentTask.deadline;
console.log(day)
descrip.textContent = description;
taskName.textContent = name;

dokho.textContent = diff;
deadline.textContent = day;

const setTaskCards = (arr = tasks) => {

  taskCards.innerHTML = "";
  arr.forEach(({id,name,deadline,description,difficulty}) => {
    taskCards.innerHTML += 
        `  
          <div class="task-card" id="${id}">
            <h2> ${name}</h2>
            <p>Mô tả: ${description}</p>
            <p>Deadline: ${deadline}</p>
            <p>Độ khó: ${diff}</p>
            <button type="button" id="edit-btn" class="btn" onclick="editTask(this)"><label for="edit-btn"><i class="fa-solid fa-pen-to-square"></i></label></button>
            <button type="button" id="delete-btn" class="btn" onclick="deleteTask(this)"><label for="delete-btn"><i class="fa-solid fa-trash"></i></label></button>
        </div>
        `
  });
}
//setTaskCards(result);
tasksDropdownList.addEventListener("change", (e) => {

  switch (e.target.value) {
    case "by-deadline":
      setTaskCards(tasks.filter((task) => tasks.day !== null));
      break;
    case "by-diff":
      setTaskCards(tasks.filter((task) => task.diff === 1));
      console.log(taskCards.innerHTML);
      console.log("Độ khó")
      break;
    case "by-complete":
      setTaskCards(tasks.filter((task) => task.isDone != ""));
      break;
    case "executing":
      setTaskCards(tasks.filter((task) => task.isDone === ""));
      break;
    case "done":
      setTaskCards(tasks.filter((task) => task.isDone === false));
      break;
    default:
      setTaskCards();
      console.log("Default");
  }


}
)

// Add task section function
const reset = () => {
  addOrUpdateTaskBtn.innerText = "Thêm việc";
  titleInput.value = "";
  dateInput.value = "";
  descriptInput.value = "";
  diffInput.forEach((item) => {
    item.checked = false;
  });
  taskForm.classList.toggle("hidden");
  currentTask = {};
}

const addOrUpdateTask = () => {
  const dataArrIndex = tasks.findIndex((item) => item.id === currentTask.id);
  diffInput.forEach((item) => {
    if (item.checked === true) diff = item.value;
    
  })
  
  const taskObj = {
    id: `${(dateInput.value).split("-").join("")}${Date.now()}`,
    name: titleInput.value.toLowerCase().trim(),
    deadline: dateInput.value,
    description: descriptInput.value,
    difficulty: diff
  };
  //console.log("giá trị",difficulty);
  if (dataArrIndex === -1){
    tasks.unshift(taskObj);
  }
  else {
    tasks[dataArrIndex] = taskObj;
  }
  localStorage.setItem("data",JSON.stringify(tasks));
  updateTaskContainer();
  reset();
}
const deleteTask = (buttonEl) => {
  const dataArrIndex = tasks.findIndex((item) => item.id === buttonEl.parentElement.id);
  buttonEl.parentElement.remove();
  tasks.splice(dataArrIndex,1);
  localStorage.setItem("data",JSON.stringify(tasks));
}
const editTask = (buttonEl) => {
  const dataArrIndex = tasks.findIndex((item) => item.id === buttonEl.parentElement.id);
  currentTask = tasks[dataArrIndex];
  titleInput.value = currentTask.name;
  dateInput.value = currentTask.deadline;
  descriptInput.value = currentTask.description;
  diffInput.forEach((item) => {
    if (item.value == currentTask.difficulty) item.checked = true;
  });
addOrUpdateTaskBtn.innerText = "Sửa thông tin";

}
const updateTaskContainer = () => {
  taskCards.innerHTML = "";
  tasks.forEach(({id,name,deadline,description,difficulty}) => {
    taskCards.innerHTML += 
        `  
          <div class="task-card" id="${id}">
            <h2> ${name}</h2>
            <p>Mô tả: ${description}</p>
            <p>Deadline: ${deadline}</p>
            <p>Độ khó: ${diff}</p>
            <button type="button" id="edit-btn" class="btn" onclick="editTask(this)"><label for="edit-btn"><i class="fa-solid fa-pen-to-square"></i></label></button>
            <button type="button" id="delete-btn" class="btn" onclick="deleteTask(this)"><label for="delete-btn"><i class="fa-solid fa-trash"></i></label></button>
        </div>
        `
  });
}
openTaskFormBtn.addEventListener("click", () =>
  taskForm.classList.toggle("hidden")

);
closeTaskFormBtn.addEventListener("click", () => {
  const formInputsContainValues = titleInput.value || dateInput.value || descriptInput.value;
  const formInputsValueUpdated = titleInput.value !== currentTask.name || dateInput.value !== currentTask.deadline || descriptInput.value !== currentTask.description;
  if(formInputsContainValues)
  {
    confirmCloseDialog.showModal();
  }
  else {
    reset();
  }
  
})

cancelBtn.addEventListener("click", () =>

  confirmCloseDialog.close()
);
console.log(diffInput)
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();
  reset();
});
// Get data from input and save to taskData array

taskForm.addEventListener("submit", (e) => {
  let diff;
  e.preventDefault();
  // const dataArrIndex = tasks.findIndex((item) => item.id === currentTask.id);
  // diffInput.forEach((item) => {
  //   if (item.checked) diff = item.value;
  // })
  // const taskObj = {
  //   id: `${(dateInput.value).split("-").join("")}${Date.now()}`,
  //   name: titleInput.value.toLowerCase().trim(),
  //   deadline: dateInput.value,
  //   description: descriptInput.value,
  //   difficulty: diff
  // };
  // if (dataArrIndex === -1){
  //   tasks.unshift(taskObj);
  // }
  console.log(tasks);
  // tasks.forEach(({id,name,deadline,description,difficulty}) => {
  //   taskCards.innerHTML += 
  //       `  
  //         <div class="task-card" id="${id}">
  //           <h2> ${name}</h2>
  //           <p>Mô tả: ${description}</p>
  //           <p>Deadline: ${deadline}</p>
  //           <p>Độ khó: ${difficulty}</p>
  //           <button type="button" class="btn"><i class="fa-solid fa-pen-to-square"></i>Sửa</button>
  //           <button type="button" class="btn"><i class="fa-solid fa-trash"></i>Xóa</button>
  //       </div>
  //       `
  //});
  addOrUpdateTask();
  taskForm.classList.toggle("hidden");
}
)