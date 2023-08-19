# TremTec Labs

This project implements the web app for
[TremTec labs](https://labs.tremtec.com).

## Tech Stack

- [Deno](https://deno.land/)
- [Fresh](https://fresh.deno.dev/)
- [Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/)

### Install CLI

```sh
# local
curl -sSfL http://localhost:8000/install | bash

# prod
curl -sSfL https://labs.tremtec.com/install | bash
```


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
