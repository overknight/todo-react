import { Component } from 'react';

export class NewTaskForm extends Component {
  state = {
    value: '',
    timer: {},
  };

  fieldFormat = (e) => {
    this.setState({ value: e.target.value.trimStart() });
  };

  setTimer = (e) => {
    let value = e.target.value;
    value = Number(value.replace(' ', ''));
    if (isNaN(value)) return;
    const k = e.target.name.replace('new-task-timer-', '');
    const { timer } = this.state;
    timer[k] = value;
    this.setState({ timer });
  };

  newTask = (e) => {
    e.preventDefault();
    const title = this.state.value;
    const creationDate = Date.now();
    const newTaskInfo = { title, creationDate };
    const { min = 0, sec = 0 } = this.state.timer;
    const duration = (min * 60 + sec) * 1000;
    if (duration > 0) Object.assign(newTaskInfo, { duration });
    this.props.app.newTask(newTaskInfo, () => {
      this.setState({ value: '', timer: {} });
      if (/mobile/i.test(navigator.userAgent)) document.activeElement.blur();
      else e.target.querySelector('[name="new-task-name"]').focus();
    });
  };

  render() {
    return (
      <form className="new-todo-form" action="" onSubmit={this.newTask}>
        <input
          type="text"
          name="new-task-name"
          className="new-todo"
          placeholder="What needs to be done?"
          autoFocus
          autoComplete="off"
          value={this.state.value}
          onChange={this.fieldFormat}
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          name="new-task-timer-min"
          className="new-todo-form__timer"
          placeholder="Min"
          autoComplete="off"
          value={this.state.timer.min || ''}
          onChange={this.setTimer}
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="\d*"
          name="new-task-timer-sec"
          className="new-todo-form__timer"
          placeholder="Sec"
          autoComplete="off"
          value={this.state.timer.sec || ''}
          onChange={this.setTimer}
        />
        <input type="submit" style={{ visibility: 'hidden', width: '0', margin: '0', padding: '0', border: 'none' }} />
      </form>
    );
  }
}
