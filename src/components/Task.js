import { useState, useEffect, useRef } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

export const visibleTasks = new Set();

const keyboardHandler = function (e) {
  if (e.type != 'keyup') return;
  if (e.keyCode == 27) {
    // esc key
    this.cancel();
  }
  if (e.keyCode == 13) {
    // enter key
    const value = e.target.value.trimEnd();
    if (!value) {
      this.cancel();
      return;
    }
    this.commit(value);
  }
};

const taskEditorField = (value, editor) => {
  return (
    <input
      type="text"
      className="edit"
      defaultValue={value}
      onKeyUp={keyboardHandler.bind(editor)}
      onBlur={editor.cancel}
      autoFocus
    />
  );
};

export const Task = ({
  title,
  completed = false,
  editor,
  duration = 0,
  running,
  onTaskAction,
  creationDate = Date.now(),
}) => {
  const btnRef = useRef();
  const [formattedAge, setFormattedAge] = useState(formatDistanceToNow(creationDate));
  useEffect(() => {
    const hooks = {};
    Object.defineProperties(hooks, {
      formattedAge: {
        get() {
          return formattedAge;
        },
        set(value) {
          setFormattedAge(value);
        },
      },
      creationDate: {
        get() {
          return creationDate;
        },
        set() {
          throw new Error('property creationDate is read only');
        },
      },
    });
    visibleTasks.add(hooks);
    return () => {
      visibleTasks.delete(hooks);
    };
  }, []);
  const editable = !completed && !editor.active;
  const btnTimerTitle = (completed ? '' : running ? 'stop ' : 'start ') + 'task timer';
  const btnTimerIcon = completed ? null : running ? (
    <svg width="18px" height="18px" viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12H6V0H2V0Z"></path>
      <path d="M8 12H12V0H8V0Z"></path>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 14" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 0V14L14 7.045L3 0Z"></path>
    </svg>
  );
  const view = (
    <div className="view">
      <label onClick={onTaskAction}>
        <input className="toggle" type="checkbox" title="Toggle status" checked={completed} readOnly />
        <span className="status-indicator"></span>
        <span className="description">{title}</span>
        <div className="timer" title={btnTimerTitle}>
          {btnTimerIcon}
          <span>{format(duration, 'mm:ss')}</span>
        </div>
        <span className="created">{formattedAge}</span>
      </label>
      <button
        ref={btnRef}
        className={editable ? 'icon icon-edit' : 'icon icon-edit disabled'}
        title="Edit task"
        onClick={editable ? onTaskAction : null}
      ></button>
      <button className="icon icon-destroy" title="Destroy task" onClick={onTaskAction}></button>
    </div>
  );
  let taskStatus = completed ? 'completed' : null;
  let isEditing = Boolean(editor.domRef);
  if (isEditing) isEditing = btnRef.current === editor.domRef;
  if (isEditing) taskStatus = 'editing';
  return (
    <li className={taskStatus}>
      {view}
      {isEditing ? taskEditorField(title, editor) : null}
    </li>
  );
};
