export function NewTaskForm({ app }) {
  return (
    <form onSubmit={app.newTask}>
      <input type="text" name="new-task-name" className="new-todo" placeholder="What needs to be done?" autoFocus />
    </form>
  );
}
