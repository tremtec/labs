import * as assert from "$std/assert/mod.ts";
import { TaskDao } from "~/repositories/task.ts";
import { v1 } from "$std/uuid/mod.ts";

Deno.test("Task DAO", async (t) => {
  const taskId = v1.generate().toString();
  const input = { id: taskId, title: "Hello" };
  const userId = "some";
  const kv = await Deno.openKv("/tmp/" + Math.random());
  const tasks = new TaskDao(kv, userId);

  await t.step("should list by last updated", async () => {
    const task1 = await tasks.add({ title: "one" });
    const task2 = await tasks.add({ title: "another" });
    const expectedTasks = [task2, task1];

    const taskList = await tasks.list();
    assert.assertEquals(taskList, expectedTasks);

    await Promise.all(
      expectedTasks.map(({ id }) => tasks.delete(id)),
    );

    assert.assertEquals(await tasks.list(), []);
  });

  await t.step("should add an item", async () => {
    const task = await tasks.add(input);
    assert.assertEquals(task.id, taskId);
  });

  await t.step("should get an item", async () => {
    const task = await tasks.get(input.id);
    assert.assertEquals(task?.id, input.id);
    assert.assertEquals(task?.title, input.title);
  });

  await t.step("should update an item", async () => {
    const expectedText = "expected text";

    let task = await tasks.get(input.id);
    assert.assertEquals(task?.id, input.id);
    assert.assertEquals(task?.title, input.title);

    task = await tasks.upsert({
      ...input,
      title: expectedText,
      description: expectedText,
    });

    assert.assertEquals(task?.id, input.id);
    assert.assertEquals(task?.title, expectedText);
    assert.assertEquals(task?.description, expectedText);
    assert.assertEquals(await tasks.list(), [task]);
  });

  await t.step("should upsert an new item", async () => {
    const unexistentId = v1.generate().toString();
    const expectedText = "expected text";

    const inputInexistent = {
      id: unexistentId,
      title: expectedText,
    };

    let task = await tasks.get(inputInexistent.id);
    assert.assertEquals(task, null);

    task = await tasks.upsert({
      ...inputInexistent,
      title: expectedText,
      description: expectedText,
    });

    assert.assertEquals(task?.id, inputInexistent.id);
    assert.assertEquals(task?.title, expectedText);

    await tasks.delete(inputInexistent.id);
  });

  await t.step("should delete an item", async () => {
    let task = await tasks.get(input.id);
    assert.assertExists(task);

    await tasks.delete(input.id);

    task = await tasks.get(input.id);
    assert.assertEquals(task, null);
    assert.assertEquals(await tasks.list(), []);
  });

  await t.step("should return null if task id does exists", async () => {
    const task = await tasks.get(v1.generate().toString());
    assert.assertEquals(task, null);
  });

  kv.close();
});
