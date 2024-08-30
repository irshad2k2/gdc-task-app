const fs = require("fs");

// Print Help
const help = () => {
  console.log(`Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`);
};

// Read and Write to file
const readFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  return fs
    .readFileSync(filePath, "utf-8")
    .trim()
    .split("\n")
    .filter((line) => line);
};

const writeFile = (filePath, data) => {
  fs.writeFileSync(filePath, data.join("\n") + "\n", "utf-8");
};

// Add Task
const addTask = (priority, task) => {
  if (!priority || !task) {
    console.log("Error: Missing tasks string. Nothing added!");
    return;
  }
  const tasks = readFile("task.txt");
  tasks.push(`${priority} ${task}`);
  tasks.sort((a, b) => parseInt(a.split(" ")[0]) - parseInt(b.split(" ")[0]));
  writeFile("task.txt", tasks);
  console.log(`Added task: "${task}" with priority ${priority}`);
};

// List Tasks
const listTasks = () => {
  const tasks = readFile("task.txt");
  if (tasks.length === 0) {
    console.log("There are no pending tasks!");
  } else {
    tasks.forEach((task, index) => {
      const [priority, ...taskText] = task.split(" ");
      console.log(`${index + 1}. ${taskText.join(" ")} [${priority}]`);
    });
  }
};

// Delete Task
const deleteTask = (index) => {
  const tasks = readFile("task.txt");
  if (typeof index === "undefined" || isNaN(index)) {
    console.log("Error: Missing NUMBER for deleting tasks.");
    return;
  }
  if (index < 1 || index > tasks.length) {
    console.log(
      `Error: task with index #${index} does not exist. Nothing deleted.`,
    );
    return;
  }
  tasks.splice(index - 1, 1);
  writeFile("task.txt", tasks);
  console.log(`Deleted task #${index}`);
};

// Mark as Done
const markDone = (index) => {
  const tasks = readFile("task.txt");
  if (typeof index === "undefined" || isNaN(index)) {
    console.log("Error: Missing NUMBER for marking tasks as done.");
    return;
  }
  if (index < 1 || index > tasks.length) {
    console.log(`Error: no incomplete item with index #${index} exists.`);
    return;
  }
  const completed = readFile("completed.txt");
  completed.push(
    tasks
      .splice(index - 1, 1)[0]
      .split(" ")
      .slice(1)
      .join(" "),
  );
  writeFile("task.txt", tasks);
  writeFile("completed.txt", completed);
  console.log("Marked item as done.");
};

// Report
const report = () => {
  const tasks = readFile("task.txt");
  const completed = readFile("completed.txt");

  console.log(`Pending : ${tasks.length}`);
  tasks.forEach((task, index) => {
    const [priority, ...taskText] = task.split(" ");
    console.log(`${index + 1}. ${taskText.join(" ")} [${priority}]`);
  });

  console.log(`\nCompleted : ${completed.length}`);
  completed.forEach((task, index) => {
    console.log(`${index + 1}. ${task}`);
  });
};

// Main Execution
const args = process.argv.slice(2);

switch (args[0]) {
  case "help":
    help();
    break;
  case "add":
    addTask(args[1], args.slice(2).join(" "));
    break;
  case "ls":
    listTasks();
    break;
  case "del":
    deleteTask(parseInt(args[1]));
    break;
  case "done":
    markDone(parseInt(args[1]));
    break;
  case "report":
    report();
    break;
  default:
    help();
    break;
}
