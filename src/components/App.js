import { Component } from 'react';
import { formatDistanceToNow } from 'date-fns';

import { NewTaskForm } from './NewTaskForm';
import { TaskList, visibleTasks, runningTasks, startTaskTimer } from './TaskList';
import { Footer } from './Footer';

const Header = (props) => {
  return (
    <header className="header">
      <h1>{process.env.REACT_APP_NAME}</h1>
      <NewTaskForm {...props} />
    </header>
  );
};

const filterFunctions = {
  Active: (item) => !item.completed,
  Completed: (item) => item.completed,
  default: () => true,
};

let newTaskID = 1;

const createTask = ({ title, completed, running, duration, creationDate }) => {
  const id = newTaskID++;
  const result = { title, id };
  if (completed) Object.assign(result, { completed });
  if (running) Object.assign(result, { running });
  if (duration) Object.assign(result, { duration });
  if (creationDate) Object.assign(result, { creationDate });
  return result;
};

let idRefreshInterval;

class App extends Component {
  state = {
    data: [
      createTask({ title: 'Completed task', duration: 745000, creationDate: 1720812970158, completed: true }),
      createTask({ title: 'Editing task' }),
      createTask({ title: 'Active task', running: true, creationDate: 1720628035017 }),
    ],
    currentFilter: 'All',
    editingTask: false,
  };

  newTask = (taskInfo, callback) => {
    this.setState(({ data }) => {
      return { data: [...data, createTask(taskInfo)] };
    }, callback);
  };

  updateTaskInfo = (id, e) => {
    let target = e.target;
    if (target.className != 'toggle')
      while (target.constructor !== HTMLLabelElement) {
        if (target.className == 'timer') {
          e.preventDefault();
          break;
        }
        target = target.parentElement;
      }
    if (!~['toggle', 'timer'].indexOf(target.className)) return;
    this.setState(({ data }) => {
      const newData = [...data];
      const idx = newData.findIndex((item) => item.id === id);
      let taskInfo = {};
      if (target.className == 'timer' && newData[idx].completed) {
        target.parentElement.querySelector('.toggle').checked = false;
        taskInfo.completed = false;
      } else if (target.className == 'timer') {
        const running = !newData[idx].running;
        if (!running) delete runningTasks[id];
        else startTaskTimer(id);
        taskInfo = { running };
      } else {
        const completed = !newData[idx].completed;
        taskInfo = { completed };
        if (completed && newData[idx].running) {
          taskInfo.running = false;
          delete runningTasks[id];
        }
      }
      newData[idx] = {
        ...newData[idx],
        ...taskInfo,
      };
      return { data: newData };
    });
  };

  removeTask = (id) => {
    this.setState(({ data }) => {
      const newData = [...data];
      const idx = newData.findIndex((item) => item.id === id);
      if (newData[idx].running) delete runningTasks[id];
      return { data: [...newData.slice(0, idx), ...newData.slice(idx + 1)] };
    });
  };

  removeCompletedTasks = () => {
    this.setState(({ data }) => {
      return { data: data.filter((item) => !item.completed) };
    });
  };

  setFilter = (e) => {
    this.setState({ currentFilter: e.target.innerText });
  };

  taskEditStarted = () => {
    this.setState({ editingTask: true });
  };

  taskEditCanceled = () => {
    this.setState({ editingTask: false });
  };

  taskEditFinished = (id, newValue) => {
    newValue = newValue.trimEnd();
    this.setState(({ data }) => {
      if (newValue == '') return { editingTask: false };
      const newData = [...data];
      const idx = newData.findIndex((item) => item.id === id);
      if (idx > -1) {
        newData[idx] = {
          ...newData[idx],
          title: newValue,
        };
      }
      return { data: newData, editingTask: false };
    });
  };

  updateDurations = () => {
    for (const task of visibleTasks) {
      const timeDistance = formatDistanceToNow(task.props.creationDate);
      if (timeDistance != task.state.formattedAge) {
        task.setState({ formattedAge: timeDistance });
      }
    }
    this.setState(({ data }) => {
      const newData = [...data];
      const now = Date.now();
      for (const [id, { lastUpdate }] of Object.entries(runningTasks)) {
        const idx = newData.findIndex((item) => item.id == id);
        if (!~idx) return;
        const timeDelta = now - lastUpdate;
        let duration = newData[idx].duration || 0;
        duration += timeDelta;
        newData[idx] = { ...newData[idx], duration };
        runningTasks[id].lastUpdate = now;
      }
      return { data: newData };
    });
  };

  componentDidMount() {
    for (const task of this.state.data) {
      if (task.running) startTaskTimer(task.id);
    }
    if (!idRefreshInterval) idRefreshInterval = setInterval(this.updateDurations, 1000);
  }

  render() {
    const { currentFilter } = this.state;
    let { data } = this.state;
    if (currentFilter !== 'All') {
      const filterFunc = filterFunctions[currentFilter] || filterFunctions['default'];
      data = data.filter(filterFunc);
    }
    return (
      <>
        <Header app={this} />
        <section className="main">
          <TaskList
            dataSrc={data}
            onTaskInfoUpdated={this.updateTaskInfo}
            onTaskRemove={this.removeTask}
            editingTask={this.state.editingTask}
            beginEditTask={this.taskEditStarted}
            cancelTaskEditing={this.taskEditCanceled}
            finishTaskEdit={this.taskEditFinished}
          />
          <Footer
            dataSrc={this.state.data}
            applyFilter={this.setFilter}
            currentFilter={this.state.currentFilter}
            parent={this}
          />
        </section>
      </>
    );
  }
}

export { App };
