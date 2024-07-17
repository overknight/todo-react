import { Component } from 'react';

export class NewTaskForm extends Component {
  state = {
    value: '',
  };

  fieldFormat = (e) => {
    this.setState({ value: e.target.value.trimStart() });
  };

  render() {
    const { app } = this.props;
    return (
      <form onSubmit={app.newTask}>
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
      </form>
    );
  }
}
