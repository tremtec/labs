export class Database {
  connect() {
    return Deno.openKv();
  }
}
