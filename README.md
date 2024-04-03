# LMSTL project

Steps to run this project:

first copy **.env.example** file and create to **.env**

1. Run `nvm use` or `nvm use 17` command to use initial node version
2. Run `cd ./client` and then `yarn install` command to install dependencies and then comeback `cd ..`
3. Run `cd ./server` and then `yarn install` command to install dependencies and then comeback `cd ..`
4. Run `make dev` command to start and setting up project
5. Run `make psql` command to start DB in another tab
6. Run `yarn run typeorm:run` command to migration database
7. Let's start !
