import { useState, useEffect } from 'react';

import { NewTaskForm } from './NewTaskForm';
import { TaskList, taskActions, taskEditor, createTask, startTaskTimer } from './TaskList';
import { Footer } from './Footer';

const Header = () => {
  return (
    <header className="header">
      <h1>{process.env.REACT_APP_NAME}</h1>
      <NewTaskForm newTaskAction={taskActions.create} />
    </header>
  );
};

const useFilter = (() => {
  let currentFilter = 'All',
    setFilter;
  const filter = {};
  Object.defineProperties(filter, {
    apply: {
      value: ({ target: { innerText: value } }) => {
        setFilter(value);
      },
    },
    func: {
      get() {
        return {
          Active: (item) => !item.completed,
          Completed: (item) => item.completed,
        }[currentFilter];
      },
      set() {
        throw new Error('func property is read only');
      },
    },
    toString: {
      value: () => currentFilter,
    },
  });
  return (filterType) => {
    [currentFilter, setFilter] = useState(filterType);
    return filter;
  };
})();

const useTasks = () => {
  const [data, setData] = useState([
    createTask({ title: 'Completed task', duration: 745000, creationDate: 1721075261075, completed: true }),
    createTask({ title: 'Editing task' }),
    createTask({ title: 'Active task', running: true, creationDate: 1735124059103 }),
  ]);
  taskActions.getDataHooks(data, setData);
  taskEditor.getHooks(...useState(NaN));
  return data;
};

let idRefreshInterval;

const App = () => {
  const data = useTasks(),
    filter = useFilter('All');
  useEffect(() => {
    for (const task of data) {
      if (task.running) startTaskTimer(task.id);
    }
    if (!idRefreshInterval) idRefreshInterval = setInterval(taskActions.timingsUpdate, 1000);
  }, []);
  let filteredTasks = null;
  const taskCounters = { completed: data.filter((item) => item.completed).length };
  taskCounters.uncompleted = data.length - taskCounters.completed;
  const currentFilter = filter.toString();
  if (currentFilter !== 'All') {
    const func = filter.func;
    filteredTasks = func ? data.filter(func) : null;
  }
  return (
    <>
      <Header />
      <section className="main">
        <TaskList dataSrc={filteredTasks || data} />
        <Footer {...{ taskCounters, filter, removeCompleted: taskActions.removeCompleted }} />
      </section>
    </>
  );
};

export { App };
