
# BOOK ZONE

![Library management system](https://img.shields.io/badge/Library--management-system-brightgreen)

An interactive web portal for automating various manual processes done by librarian and student.

There are various problems also faced by the student in library such as finding any particular book, information whether book is available or not, for what time this book will be available. To eliminate this manual system, Library Management System has been developed.


## Features

- Displaying all book records.
- Update Book Records.
- Delete Book Records.
- Issue books.

## Modules
- Admin login.
- Student login.
- Add and Update Books.
- Issue books.
## Technology Stack Used


- Front End - HTML, CSS, JavaScript.
- Backend - Nodejs, Expressjs.
- Database - Mongodb.
## Requirements

- The source code of this project is written in Node js. So, you'll require Node preinstalled to run this project.
## Run Locally

Clone the project

```bash
  git clone https://github.com/UtkarshAhuja2003/BookZone.git
```

Go to the project directory

```bash
  cd BookZone
```

Install dependencies

```bash
  npm install
```

Create a .env file. then, declare this variable in .env file

```bash
  STUDENT_SECRET_KEY = "Write your secret key"
  ADMIN_SECRET_KEY = "Write your secret key"
```

Start the server

```bash
  npm run dev
```

