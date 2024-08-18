import { formatDistanceToNow } from 'date-fns';

import { Task, visibleTasks } from './Task';

const err_incorrectData = new TypeError('incorrect data format');

const runningTasks = new Map();

export const startTaskTimer = function (id) {
  runningTasks.set(id, { lastUpdate: Date.now() });
};

let newTaskID = 1;

export const createTask = ({ title, completed, running, duration, creationDate }) => {
  const id = newTaskID++;
  const result = { title, id };
  if (completed) Object.assign(result, { completed });
  if (running) Object.assign(result, { running });
  if (duration) Object.assign(result, { duration });
  if (creationDate) Object.assign(result, { creationDate });
  return result;
};

export const taskActions = (() => {
  let data, setData;
  const modifyTask = (taskID, propName, value) => {
    const idx = data.findIndex((item) => item.id == taskID);
    const taskInfo = data[idx];
    let shouldToggleValue = Boolean(~['running', 'completed'].indexOf(propName));
    if (propName == 'running' && taskInfo.completed) {
      propName = 'completed';
      value = false;
      shouldToggleValue = false;
    }
    if (value === undefined && !shouldToggleValue) return;
    if (shouldToggleValue) value = !taskInfo[propName];
    taskInfo[propName] = value;
    if (shouldToggleValue) {
      if ((propName == 'completed' && taskInfo.running) || (propName == 'running' && !value)) {
        runningTasks.delete(taskID);
      } else if (propName == 'running') startTaskTimer(taskID);
      if (propName == 'completed' && taskInfo.running) taskInfo.running = false;
    }
    data[idx] = { ...taskInfo };
    setData([...data]);
  };
  return {
    getDataHooks: function () {
      [data, setData] = arguments;
    },
    rename: (id, value) => {
      modifyTask(id, 'title', value.replace(/\s{2,}/g, ' '));
    },
    delete: (taskID) => {
      const idx = data.findIndex((item) => item.id === taskID);
      if (data[idx].running) runningTasks.delete(taskID);
      setData([...data.slice(0, idx), ...data.slice(idx + 1)]);
    },
    removeCompleted: () => {
      setData((data) => data.filter((item) => !item.completed));
    },
    toggleStatus: (id) => {
      modifyTask(id, 'completed');
    },
    toggleTimer: (id) => {
      modifyTask(id, 'running');
    },
    create: (taskName, duration) => {
      const taskInfo = { title: taskName.trimEnd().replace(/\s{2,}/g, ' ') };
      if (duration) Object.assign(taskInfo, { duration });
      setData((data) => [...data, createTask(taskInfo)]);
    },
    timingsUpdate: () => {
      for (const task of visibleTasks) {
        const timeDistance = formatDistanceToNow(task.creationDate);
        if (timeDistance != task.formattedAge) {
          task.formattedAge = timeDistance;
        }
      }
      if (runningTasks.size > 0)
        setData((data) => {
          const now = Date.now();
          for (const [id, { lastUpdate }] of runningTasks) {
            const idx = data.findIndex((item) => item.id == id);
            if (!~idx) return data;
            const timeDelta = now - lastUpdate;
            let duration = data[idx].duration || 0;
            duration += timeDelta;
            Object.assign(runningTasks.get(id), { lastUpdate: now });
            data[idx] = { ...data[idx], duration };
          }
          return [...data];
        });
    },
  };
})();

export const taskEditor = (() => {
  let editorTarget = NaN,
    setEditorTarget = null,
    setActiveState = null;
  const deactivate = () => {
    setEditorTarget(NaN);
    setActiveState(false);
    setActiveState = null;
  };
  return Object.defineProperties(
    {
      getHooks: function () {
        [editorTarget, setEditorTarget] = arguments;
      },
      getTaskHook: (hook) => {
        setActiveState = hook;
      },
      begin: (taskID) => {
        setEditorTarget(taskID);
      },
      cancel: () => {
        deactivate();
      },
      commit: (value) => {
        value = value.trimStart();
        taskActions.rename(editorTarget, value);
        deactivate();
      },
    },
    {
      taskID: {
        get() {
          return editorTarget;
        },
        set() {
          throw new Error('forbidden to explicitly change editor target');
        },
      },
    }
  );
})();

const actionsMap = new Map([
  ['toggle', taskActions.toggleStatus],
  ['icon icon-edit', taskEditor.begin],
  ['icon icon-destroy', taskActions.delete],
]);

const taskInfoEventHandler = (id, event) => {
  let target = event.target;
  if (target.className != 'toggle')
    while (target.constructor !== HTMLLabelElement) {
      if (target.className == 'timer') {
        event.preventDefault();
        taskActions.toggleTimer(id);
        return;
      }
      target = target.parentElement;
      if (!target) {
        target = event.target;
        break;
      }
    }
  const action = actionsMap.get(target.className);
  if (!action) return;
  action(id);
};

export const TaskList = ({ dataSrc }) => {
  const elements = dataSrc.map((item) => {
    const { id, ...taskInfo } = item;
    return <Task key={id} {...taskInfo} onTaskAction={taskInfoEventHandler.bind(null, id)} editor={taskEditor} />;
  });
  return <ul className="todo-list">{elements}</ul>;
};

TaskList.propTypes = {
  dataSrc: (props, propName) => {
    const value = props[propName];
    if (!Array.isArray(value)) return err_incorrectData;
    for (const item of value) {
      if (item.title === undefined || item.id === undefined) return err_incorrectData;
    }
    return null;
  },
};
