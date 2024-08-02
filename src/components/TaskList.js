import { Task, visibleTasks } from './Task';

const err_incorrectData = new TypeError('incorrect data format');

export { visibleTasks };

export const runningTasks = {};

const startTaskTimer = function (id) {
  runningTasks[id] = { lastUpdate: Date.now() };
};

export const TaskList = ({
  dataSrc,
  onTaskInfoUpdated,
  onTaskRemove,
  beginEditTask,
  cancelTaskEditing,
  finishTaskEdit,
  editingTask = false,
}) => {
  const elements = dataSrc.map((item) => {
    const { id, ...taskInfo } = item;
    return (
      <Task
        key={id}
        {...taskInfo}
        onInfoUpdate={onTaskInfoUpdated.bind(null, id)}
        onRemove={onTaskRemove.bind(null, id)}
        isEditingOtherTask={editingTask}
        onEditStart={beginEditTask}
        onEditCanceled={cancelTaskEditing}
        onEditFinished={finishTaskEdit.bind(null, id)}
        onTimerStart={startTaskTimer.bind(null, id)}
      />
    );
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
