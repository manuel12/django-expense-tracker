from django.contrib.auth.models import User
from django.test import TestCase
from django.utils import timezone

from expenses import utils
from expenses.forms import BudgetForm, ExpenseForm
from expenses.models import Budget, Expense

test_data_file = "expenses/tests/testData.json"


class TestExpenseForm(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        expenses = test_data["expenses"]
        users = test_data["testusers"]
        expense = dict(expenses[0])

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

        self.data = {
            "amount": self.test_expense.amount,
            "content": self.test_expense.content,
            "category": self.test_expense.category,
            "source": self.test_expense.source,
            "date": timezone.now(),
        }

    def test_valid_form(self):
        form = ExpenseForm(data=self.data)
        self.assertTrue(form.is_valid())

    def test_amount_cannot_be_less_than_1_cent(self):
        self.data["amount"] = 0.001
        form = ExpenseForm(data=self.data)
        self.assertFalse(form.is_valid())

    def test_content_cannot_be_longer_than_100_chars(self):
        self.data["content"] = "x" * 101
        form = ExpenseForm(data=self.data)
        self.assertFalse(form.is_valid())

    def test_category_has_to_exist(self):
        self.data["category"] = "non-existant-category"
        form = ExpenseForm(data=self.data)
        self.assertFalse(form.is_valid())

    def test_source_cannot_be_longer_than_30_chars(self):
        self.data["source"] = "x" * 31
        form = ExpenseForm(data=self.data)
        self.assertFalse(form.is_valid())

    def test_date_cannot_have_incorrect_format(self):
        self.data["date"] = "First of January of twenty twenty one."
        form = ExpenseForm(data=self.data)
        self.assertFalse(form.is_valid())


class TestBudgetForm(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        budget = test_data["budgetData"]
        users = test_data["testusers"]

        owner = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )

        self.test_budget = Budget.objects.create(amount=budget["amount"], owner=owner)

        self.data = {"amount": self.test_budget.amount, "owner": self.test_budget.owner}

    def test_valid_form(self):
        form = BudgetForm(data=self.data)
        self.assertTrue(form.is_valid())

    def test_amount_cannot_be_less_than_1_cent(self):
        self.data["amount"] = 0.001
        form = BudgetForm(data=self.data)
        self.assertFalse(form.is_valid())
