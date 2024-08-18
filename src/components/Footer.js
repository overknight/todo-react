import { TasksFilter } from './TasksFilter';

export const Footer = ({ taskCounters, filter, removeCompleted }) => {
  let tasksMessage = 'no active tasks';
  if (taskCounters.uncompleted > 0) {
    tasksMessage = taskCounters.uncompleted + ' item' + (taskCounters.uncompleted > 1 ? 's' : '') + ' left';
  }
  const filterButtons = taskCounters.uncompleted === 0 ? null : <TasksFilter {...{ filter }} />;
  const btn_clearCompleted = {
    className: 'clear-completed',
    onClick: taskCounters.completed > 0 ? removeCompleted : null,
  };
  if (taskCounters.completed === 0) btn_clearCompleted.className += ' disabled';
  return (
    <footer className="footer">
      <span className="todo-count">{tasksMessage}</span>
      {filterButtons}
      <button {...btn_clearCompleted}>Clear completed</button>
    </footer>
  );
};
