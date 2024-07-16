import { TasksFilter } from './TasksFilter';

export const Footer = ({ dataSrc, currentFilter, parent: app }) => {
  const completedTasksCount = dataSrc.filter((item) => item.completed).length;
  const uncompletedTasksCount = dataSrc.length - completedTasksCount;
  let tasksMessage = 'no active tasks';
  if (uncompletedTasksCount > 0) {
    tasksMessage = uncompletedTasksCount + ' item' + (uncompletedTasksCount > 1 ? 's' : '') + ' left';
  }
  const filterButtons =
    uncompletedTasksCount === 0 ? null : <TasksFilter applyFilter={app.setFilter} currentFilter={currentFilter} />;
  const btn_clearCompleted = {
    className: 'clear-completed',
    onClick: completedTasksCount > 0 ? app.removeCompletedTasks : null,
  };
  if (completedTasksCount === 0) btn_clearCompleted.className += ' disabled';
  return (
    <footer className="footer">
      <span className="todo-count">{tasksMessage}</span>
      {filterButtons}
      <button {...btn_clearCompleted}>Clear completed</button>
    </footer>
  );
};
