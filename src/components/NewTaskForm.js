import { useState } from 'react';

const useInputController = (() => {
  let taskName, setTaskName, timer, setTimer, newTaskAction;
  const onInputName = (e) => {
    setTaskName(e.target.value.trimStart());
  };
  const onTimerChange = (e) => {
    let value = e.target.value;
    value = Number(value.replace(' ', ''));
    if (isNaN(value)) return;
    const k = e.target.name.replace('new-task-timer-', '');
    setTimer((timer) => {
      timer[k] = value;
      return { ...timer };
    });
  };
  const onTaskCreate = (e) => {
    e.preventDefault();
    if (!taskName) return;
    const { min = 0, sec = 0 } = timer;
    const duration = (min * 60 + sec) * 1000;
    newTaskAction(taskName, duration);
    setTimer({});
    setTaskName('');
    if (/mobile/i.test(navigator.userAgent)) document.activeElement.blur();
    else e.target.querySelector('[name="new-task-name"]').focus();
  };
  return (newTaskHandler) => {
    [taskName, setTaskName] = useState('');
    [timer, setTimer] = useState({});
    newTaskAction = newTaskHandler;
    return { taskName, onInputName, timer, onTimerChange, onTaskCreate };
  };
})();

const inputFieldOptions = {
  type: 'text',
  autoComplete: 'off',
};

const taskNameInputField = function () {
  const options = {
    ...inputFieldOptions,
    name: 'new-task-name',
    className: 'new-todo',
    placeholder: 'What needs to be done?',
    value: arguments[0],
    onChange: arguments[1],
  };
  return <input {...options} autoFocus />;
};

const taskTimerField = (timer, key, handler) => {
  const options = {
    ...inputFieldOptions,
    inputMode: 'numeric',
    name: 'new-task-timer-' + key,
    className: 'new-todo-form__timer',
    placeholder: key[0].toUpperCase() + key.slice(1),
    value: timer[key] || '',
    onChange: handler,
  };
  return <input {...options} />;
};

export const NewTaskForm = ({ newTaskAction }) => {
  const { taskName, onInputName, timer, onTimerChange, onTaskCreate } = useInputController(newTaskAction);
  return (
    <form className="new-todo-form" action="" onSubmit={onTaskCreate}>
      {taskNameInputField(taskName, onInputName)}
      {taskTimerField(timer, 'min', onTimerChange)}
      {taskTimerField(timer, 'sec', onTimerChange)}
      <input type="submit" style={{ visibility: 'hidden', width: '0', margin: '0', padding: '0', border: 'none' }} />
    </form>
  );
};
