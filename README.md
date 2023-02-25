[![expense_tracker](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/72wyad&style=plastic&logo=cypress)](https://dashboard.cypress.io/projects/72wyad/runs)

# Expense Tracker

Expense Tracker will help you track, have charts on and statistics about your expenses.

<div float="left">
  <img src="https://user-images.githubusercontent.com/4129325/221216267-0067eb7d-3be7-4771-a621-92907c10105a.png" title="Expense Tracker Desktop" alt="Expense Tracker Desktop" width="650" height="357" style="display: inline"/>
   <img src="https://user-images.githubusercontent.com/4129325/221216763-897b1481-2626-4b24-ab2c-ce424d24a51f.png" title="Expense Tracker Mobile" alt="Expense Tracker Mobile" width="165" height="357"/>
</div>

## Usage

### Adding Expenses

You can add an expense by clicking the "Add Expense" button, filling and submitting the expense form.

Once you've added the expense it will be reflected on the total expenses element, the homepage's line chart and will also be listed below on the expenses table.

![Display gif clicking Add Expense button, filling and submitting expense form and displaying expense on line chart and expense table](demo/add-expense-demo.gif)

**Note:**  
_Line chart will only appear if you have 2 or more expenses added._

### Adding Monthly Budget

You can add a monthly budget by clicking the
Add Monthly Budget button, filling and submitting the form.

Once you've added it the budget UI will be displayed, including the budget progress bar, the monthly budget next to the expenses of the current month and the edit and delete buttons.

![Display gif clicking Add Budget button, filling and submitting budget form and displaying the budget UI](demo/add-budget-demo.gif)

### Checking Charts & Statistics

Finally you can access charts and statistics about your expenses by navigating to the Charts & Statistics section.

Here you can find expense charts with amounts grouped by month and week, as well as total and monthly expenses grouped by categories.

You can find your current monthly expenses (with controls for editing or deleting budget here too), as well as last month expenses and statistics like monthly expense average, daily expense average, current vs last month expense percetange difference and more.

![Display gif navigating to Charts & Analytics section](demo/charts-and-analytics-demo.gif)

<br />

### Credentials

username: testuser1  
password: testpass1

You can check the app (please wait a bit for a free dyno to start) [here](https://expense-tracker16.herokuapp.com/).

<br />

## Installation

For installing the Django application clone the repository and run:

     pipenv install

This will install the virtual environments and all dependencies.

Now start the virtual environment shell:

     pipenv shell

**Note:**  
_Make sure you have 'DEVELOPMENT' set to True in your environment variables, in case you want to use the sqlite db.
Or if you want to use postgres set DB_NAME, DB_USER, DB_PASSWORD on your environment variables, otherwise psycopg2 will throw an error._

Run migrations:
python manage.py makemigrations
python manage.py migrate

Create superuser:

    python manage.py createsuperuser

Now you can start server...

    python manage.py runserver

...and visit http://localhost:8000/

## Installation - Cypress

For installing Cypress go to the e2e folder and run:

    npm install
    
    
## Tests

| Type | Location                                                               |
| ---- | ---------------------------------------------------------------------- |
| ui   | [e2e/cypress/integration/ui-tests](e2e/cypress/integration/ui-tests)   |
| visual   | [e2e/cypress/integration/visual-tests](e2e/cypress/integration/visual-tests)   |
| unit | [expenses/tests](expenses/tests)                             |

## Running tests

### Unit tests

For running the tests run:

    python manage.py test

### E2E tests

For running the tests run:

    npm run test

For running the tests on headless mode run:

    npm run test:headless

For opening cypress client run:

    npm run test:open

## Uses

- Django.
- Postgres.
- Bootstrap.
- Chart.js.
- Cypress.

## Features

- Expense list.
- Expense charts.
- Monthly budget bar.
- Statistics table.
- Authentication.
- Form validation.
- Pagination.
- UI tests.
- Visual tests.
- Unit tests.
