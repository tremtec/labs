import { Command } from "cliffy/command/mod.ts";

const CLI_VERSION = "0.1.0";

function main() {
  const tasks_cmd = new Command()
    .description("Manage users tasks")
    .action(() => {
      tasks_cmd.showHelp();
    })
    .command("list, l", "List your tasks")
    .action(() => {
      console.log("list tasks");
    })
    .command("create, c", "create your tasks")
    .action(() => {
      console.log("create tasks");
    })
    .command("remove, rm <id:string>", "remove a given id")
    .action(() => {
      console.log("remote tasks");
    });

  const main_cmd = new Command()
    .name("tt")
    .description("TremTec.labs CLI utility")
    .version(CLI_VERSION)
    .action(() => {
      main_cmd.showHelp();
    })
    .command("tasks, t", tasks_cmd);

  return main_cmd.parse(Deno.args);
}

if (import.meta.main) {
  await main();
}
