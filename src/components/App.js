import { Component } from 'react';

import { NewTaskForm } from './NewTaskForm';
import { TaskList } from './TaskList';
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

const createTask = ({ title, completed, creationDate }) => {
  const id = newTaskID++;
  const result = { title, id };
  if (completed) Object.assign(result, { completed });
  if (creationDate) Object.assign(result, { creationDate });
  return result;
};

class App extends Component {
  state = {
    data: [
      createTask({ title: 'Completed task', creationDate: 1720812970158, completed: true }),
      createTask({ title: 'Editing task' }),
      createTask({ title: 'Active task', creationDate: 1720628035017 }),
    ],
    currentFilter: 'All',
    editingTask: false,
  };

  newTask = (e) => {
    e.preventDefault();
    const inputField = e.target.querySelector('[name="new-task-name"]');
    if (!inputField) return;
    if (!inputField.value) return;
    this.setState(({ data }) => {
      const title = inputField.value.trimEnd();
      inputField.value = '';
      return { data: [...data, createTask({ title, creationDate: Date.now() })] };
    });
  };

  toggleTaskStatus = (id) => {
    this.setState(({ data }) => {
      const newData = [...data];
      const idx = newData.findIndex((item) => item.id === id);
      newData[idx] = {
        ...newData[idx],
        completed: !newData[idx].completed,
      };
      return { data: newData };
    });
  };

  removeTask = (id) => {
    this.setState(({ data }) => {
      const newData = [...data];
      const idx = newData.findIndex((item) => item.id === id);
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
            onTaskStatusChange={this.toggleTaskStatus}
            onTaskRemove={this.removeTask}
            editingTask={this.state.editingTask}
            beginEditTask={this.taskEditStarted}
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
