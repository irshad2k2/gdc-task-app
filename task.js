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
  default:
    help();
    break;
}
