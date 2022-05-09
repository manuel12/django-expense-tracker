from django.contrib.auth.models import User
from django.test import TestCase

from expenses import utils
from expenses.models import Expense

# Create your tests here.

test_data_file = "expenses/tests/testData.json"


class ExpenseModelManagerTests(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]
        expenses = test_data["expenses"]

        owner = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )

        self.todays_expenses = [dict(expenses[0]), dict(expenses[1])]
        self.one_week_ago_expenses = [dict(expenses[0])]
        self.one_month_ago_expenses = [dict(expenses[3])]
        self.two_month_ago_expenses = [dict(expenses[7])]

        for e in self.todays_expenses:
            Expense.objects.create(
                amount=e["amount"],
                content=e["content"],
                category=e["category"],
                source=e["source"],
                owner=owner,
            )

        for e in self.one_week_ago_expenses:
            e["date"] = utils.DateGenerator.get_date_one_week_ago()
            Expense.objects.create(
                amount=e["amount"],
                content=e["content"],
                category=e["category"],
                source=e["source"],
                date=e["date"],
                owner=owner,
            )

        for e in self.one_month_ago_expenses:
            e["date"] = utils.DateGenerator.get_date_one_month_ago()
            Expense.objects.create(
                amount=e["amount"],
                content=e["content"],
                category=e["category"],
                source=e["source"],
                date=e["date"],
                owner=owner,
            )

        for e in self.two_month_ago_expenses:
            e["date"] = utils.DateGenerator.get_date_two_months_ago()
            Expense.objects.create(
                amount=e["amount"],
                content=e["content"],
                category=e["category"],
                source=e["source"],
                date=e["date"],
                owner=owner,
            )

        self.total_expenses = (
            self.todays_expenses
            + self.one_week_ago_expenses
            + self.one_month_ago_expenses
            + self.two_month_ago_expenses
        )

        self.statistics = Expense.objects.get_statistics(owner=owner)

    def test_statistics_sum_expense(self):
        sum_expenses = sum([e["amount"] for e in self.total_expenses])
        self.assertEqual(self.statistics["sum_expense"], sum_expenses)

    def test_statistics_max_expense(self):
        max_expense = max([e["amount"] for e in self.total_expenses])
        self.assertEqual(self.statistics["max_expense"].amount, max_expense)

    def test_statistics_max_expense_content(self):
        self.assertEqual(self.statistics["max_expense_content"], "Phone bill")

    def test_statistics_min_expense(self):
        min_expense = min([e["amount"] for e in self.total_expenses])
        self.assertEqual(self.statistics["min_expense"].amount, min_expense)

    def test_statistics_min_expense_content(self):
        self.assertEqual(self.statistics["min_expense_content"], "Coca cola")

    def test_statistics_current_month_expense_sum(self):
        current_month_expenses = self.todays_expenses
        month_dates = utils.get_first_and_last_day_of_current_month()

        for month_date in utils.daterange(
            month_dates["first_day"], month_dates["last_day"]
        ):
            month_date = utils.reformat_date(month_date, "%Y-%m-%d")

            for expense in self.total_expenses:
                if "date" in expense.keys():
                    if expense["date"] == month_date:
                        current_month_expenses.append(expense)

        current_month_expenses_sum = sum([e["amount"] for e in current_month_expenses])
        self.assertEqual(
            self.statistics["curr_month_expense_sum"], current_month_expenses_sum
        )

    def test_statistics_last_month_expense_sum(self):
        todays_date_obj = utils.DateGenerator.get_date()
        todays_date_month = todays_date_obj.month

        one_week_ago_date = utils.DateGenerator.get_date_one_week_ago()
        one_week_ago_date_obj = utils.DateGenerator.get_date(one_week_ago_date)
        one_week_ago_date_month = one_week_ago_date_obj.month

        one_month_ago_expense_sum = self.one_month_ago_expenses[0]["amount"]

        if todays_date_month != one_week_ago_date_month:
            one_month_ago_expense_sum += self.one_week_ago_expenses[0]["amount"]

        self.assertEqual(
            self.statistics["one_month_ago_expense_sum"], one_month_ago_expense_sum
        )
