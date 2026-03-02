import { Command } from "commander";
import { init } from "./commands/init.js";
import { add } from "./commands/add.js";
import { list } from "./commands/list.js";

const program = new Command();

program
  .name("popapp")
  .description("Add PopApp UI components to your React Native project")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize PopApp UI in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .action(init);

program
  .command("add")
  .description("Add components to your project")
  .argument("<components...>", "Components to add")
  .option("-y, --yes", "Skip confirmation prompt")
  .action(add);

program
  .command("list")
  .description("List available components")
  .action(list);

program.parse();
