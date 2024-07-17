import { Task } from './Task';

const err_incorrectData = new TypeError('incorrect data format');

export const TaskList = ({
  dataSrc,
  onTaskStatusChange,
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
        onStatusChange={onTaskStatusChange.bind(null, id)}
        onRemove={onTaskRemove.bind(null, id)}
        isEditingOtherTask={editingTask}
        onEditStart={beginEditTask}
        onEditCanceled={cancelTaskEditing}
        onEditFinished={finishTaskEdit.bind(null, id)}
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
