class Model{
  constructor(){
    this.tasks = [
    //{id:1, text: 'Jõudu', complete: true},
    //{id:2, text: 'Tööle', complete: false}
    ]
  }
  addTask(taskText){
    let id;
    if(this.tasks.length > 0){
      id = this.tasks[this.tasks.length -1].id +1;
    } else {
      id = 1;
    }
    const task = {
      id: id,
      text: taskText,
      complete: false
    }
    this.tasks.push(task);
    this.displayTasks(this.tasks);
  }
  taskListChange(callBack){
    this.displayTasks = callBack;
  }
  deleteTask(taskId){
    const taskList = this.tasks
    this.tasks = []
    taskList.forEach(task => {
      if(task.id != taskId){
        this.addTask(task.text)
      }
    })
    this.displayTasks(this.tasks)
    console.log(this.tasks)
  }
}

class View {
  constructor(){
    this.app = this.getElement('#root');
    this.title = this.addElement('h1');
    this.title.textContent = 'Tasks';
    this.form = this.addElement('form');
    this.input = this.addElement('input');
    this.input.type = 'text';
    this.input.name = 'task';
    this.input.placeholder = 'add new task';
    this.submitBtn = this.addElement('button');
    this.submitBtn.textContent = 'Add task';
    this.taskList = this.addElement('ul');
    this.form.append(this.input, this.submitBtn);
    this.app.append(this.title, this.form, this.taskList);
  }
  displayTasks(tasks){
    while(this.taskList.firstChild){
      this.taskList.removeChild(this.taskList.firstChild)
    }
    if(tasks.length === 0){
      const p = this.addElement('p');
      p.textContent = 'Lisa omale ülesanne';
      this.taskList.append(p);
    } else {
    tasks.forEach(task => {
      const li = this.addElement('li');
      li.id = task.id;
      const checkBox = this.addElement('input');
      checkBox.type = 'checkbox';
      checkBox.checked = task.complete;
      const span = this.addElement('span');
      if(task.complete === true){
        const strike = this.addElement('s');
        strike.textContent = task.text;
        span.append(strike);
      } else {
        span.textContent = task.text;
      }
      const deleteBtn = this.addElement('button', 'delete');
      deleteBtn.textContent = 'Delete';
      li.append(checkBox, span, deleteBtn);
      this.taskList.append(li);
      })
    }
  }
  addTask(handler){
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      if(this._taskText){
        handler(this._taskText);
        this.resetInput();
      }
    })
  }
  deleteTask(handler){
    this.taskList.addEventListener('click', event => {
      if(event.target.textContent === 'Delete'){
        handler(event.target.parentElement.id);
      }
    })
  }
  get _taskText(){
    return this.input.value
  }
  getElement(selector){
    const element = document.querySelector(selector);
    return element;
  }
  addElement(tag, className){
    const element = document.createElement(tag);
    if(className !== undefined){
      element.classList.add(className);
    }
    return element;
  }
  resetInput(){
    this.input.value = '';
  }
}

class Controller{
  constructor(model, view){
    this.model = model;
    this.view = view;
    this.model.taskListChange(this.displayTasks);
    this.view.addTask(this.handleAddTask);
    this.displayTasks(this.model.tasks);
    this.view.deleteTask(this.handleDeleteTask);
  }
  displayTasks = tasks => {
    this.view.displayTasks(tasks);
  }
  handleAddTask = taskText => {
    this.model.addTask(taskText);
  }
  handleDeleteTask = task => {
    this.model.deleteTask(task);
  }
}

const app = new Controller(new Model(), new View());