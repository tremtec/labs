# TremTec Lab

This project implements the web app for [TremTec labs](https://labs.tremtec.com).

## Tech Stack

- [Deno](https://deno.land/)
- [Fresh](https://fresh.deno.dev/)
- [Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/)

### Usage

Here we have some useful commands:

```sh
# format code
deno fmt

# start project
deno task start

# encrypt and decrypt .env
deno task decrypt
deno task encrypt
```

This will watch the project directory and restart as necessary.
