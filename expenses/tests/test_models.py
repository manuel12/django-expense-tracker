from django.contrib.auth.models import User
from django.test import TestCase

from expenses import utils
from expenses.models import Budget, Expense

test_data_file = "expenses/tests/testData.json"


class ExpenseModelTests(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        expenses = test_data["expenses"]
        users = test_data["testusers"]
        expense = expenses[0]

        owner = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )

        self.test_expense = Expense.objects.create(
            amount=expense["amount"],
            content=expense["content"],
            category=expense["category"],
            source=expense["source"],
            owner=owner,
        )

    def test_model_string_representation(self):
        self.assertEqual(str(self.test_expense), str(self.test_expense.amount))


class BudgetModelTests(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        budget = test_data["budgetData"]
        users = test_data["testusers"]

        owner = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )

        self.test_budget = Budget.objects.create(amount=budget["amount"], owner=owner)

    def test_model_string_representation(self):
        self.assertEqual(str(self.test_budget), str(self.test_budget.amount))
