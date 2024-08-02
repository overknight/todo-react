import { Component } from 'react';
import { formatDistanceToNow, format } from 'date-fns';

export let visibleTasks = [];

const keyboardHandler = function (e) {
  if (e.type != 'keyup') return;
  if (e.keyCode == 27) {
    // esc key
    this.setState({
      editingTitle: false,
      value: this.props.title,
    });
    this.props.onEditCanceled();
  }
  if (e.keyCode == 13) {
    // enter key
    this.setState({ value: this.state.value.trimEnd(), editingTitle: false });
    this.props.onEditFinished(this.state.value);
  }
};

const taskEditorField = (taskRef) => {
  return (
    <input
      type="text"
      className="edit"
      value={taskRef.state.value}
      onChange={taskRef.onTitleEdited}
      onKeyUp={keyboardHandler.bind(taskRef)}
      autoFocus
    />
  );
};

export class Task extends Component {
  static defaultProps = {
    creationDate: Date.now(),
    running: false,
    duration: 0,
  };

  state = {
    editingTitle: false,
    value: this.props.title,
    formattedAge: formatDistanceToNow(this.props.creationDate),
  };

  componentDidMount() {
    visibleTasks.push(this);
    if (this.props.running) this.props.onTimerStart();
  }

  componentWillUnmount() {
    visibleTasks = visibleTasks.filter((task) => task !== this);
  }

  editTitle = (e) => {
    this.setState({
      editingTitle: true,
      newValue: this.props.title,
    });
    this.props.onEditStart(e);
  };

  onTitleEdited = (e) => {
    this.setState({ value: e.target.value.trimStart() });
  };

  remove = () => {
    this.props.onRemove();
  };

  toggleTimer = (e) => {
    if (!this.props.completed) e.stopPropagation();
    if (!this.props.running) this.props.onTimerStart();
    const event = new CustomEvent('timerToggle', { detail: { running: this.props.running } });
    this.props.onInfoUpdate(event);
  };

  render() {
    const { title, completed = false, isEditingOtherTask = false, duration, running, onInfoUpdate } = this.props;
    const { editingTitle, formattedAge } = this.state;
    const editable = completed ? false : !isEditingOtherTask;
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
        <label>
          <input
            className="toggle"
            type="checkbox"
            title="Toggle status"
            defaultChecked={completed}
            onChange={onInfoUpdate}
          />
          <span className="status-indicator"></span>
          <span className="description">{title}</span>
          <button className="timer" disabled={completed} title={btnTimerTitle} onClick={this.toggleTimer}>
            {btnTimerIcon}
            <span>{format(duration, 'mm:ss')}</span>
          </button>
          <span className="created">{formattedAge}</span>
        </label>
        <button
          className={editable ? 'icon icon-edit' : 'icon icon-edit disabled'}
          title="Edit task"
          onClick={editable ? this.editTitle : null}
        ></button>
        <button className="icon icon-destroy" title="Destroy task" onClick={this.remove}></button>
      </div>
    );
    let taskStatus = completed ? 'completed' : null;
    if (editingTitle) taskStatus = 'editing';
    return (
      <li className={taskStatus}>
        {view}
        {editingTitle ? taskEditorField(this) : null}
      </li>
    );
  }
}
