# My Charity Change Back End

## Installation
Install pipenv:
```
pip3 install pipenv
```
Install project packages:
```
pipenv install
```
Apply database migrations:
```
flask db upgrade
```

## Notes
- charity becomes active and appears in the charity list only after admin approvement
- money charge from the customers once per week by Thursdays
- money send to the charities once per week by Fridays
- asynchronous tasks are in the tasks.py file