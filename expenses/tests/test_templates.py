from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from expenses import utils
from expenses.models import Budget, Expense

test_data_file = "expenses/tests/testData.json"


class LoginPageTemplateTests(TestCase):
    def setUp(self):
        self.response = self.client.get("/accounts/login/?next=/")

    def test_loginpage_contains_correct_html(self):
        self.assertContains(self.response, "You are not logged in.")
        self.assertContains(self.response, "Sign Up")
        self.assertContains(self.response, "Log In")
        self.assertContains(self.response, "Username:")
        self.assertContains(self.response, "Password:")


class SingupPageTemplateTests(TestCase):
    def setUp(self):
        self.response = self.client.get(reverse("accounts:signup"))

    def test_signuppage_contains_correct_html(self):
        self.assertContains(self.response, "You are not logged in.")
        self.assertContains(self.response, "Sign Up")
        self.assertContains(self.response, "Log In")
        self.assertContains(self.response, "Username:")
        self.assertContains(self.response, "Password:")

        self.assertContains(
            self.response,
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
        )
        self.assertContains(
            self.response,
            "Your password can’t be too similar to your other personal information.",
        )
        self.assertContains(
            self.response, "Your password must contain at least 8 characters."
        )
        self.assertContains(
            self.response, "Your password can’t be a commonly used password."
        )
        self.assertContains(self.response, "Your password can’t be entirely numeric.")

        self.assertContains(self.response, "Password confirmation:")
        self.assertContains(
            self.response, "Enter the same password as before, for verification."
        )


class HomePageTemplateTests(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        self.username = user.username

        user.save()
        self.client.force_login(user)
        self.response = self.client.get(reverse("expenses:home"))

    def test_homepage_contains_correct_html(self):
        self.assertContains(self.response, f"Hi {self.username}!")


class CreateExpenseTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()

        self.client.force_login(user)
        self.response = self.client.get(reverse("expenses:create"))

    def test_createpage_contains_correct_html(self):
        self.assertContains(self.response, "Amount:")
        self.assertContains(self.response, "Content:")
        self.assertContains(self.response, "Category:")
        self.assertContains(self.response, "Source:")
        self.assertContains(self.response, "Date:")
        self.assertContains(self.response, "Save")
        self.assertContains(self.response, "Cancel")


class UpdateExpenseTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()
        self.client.force_login(user)

        expenses = test_data["expenses"]
        test_expense = expenses[0]
        self.test_expense = Expense.objects.create(
            amount=test_expense["amount"],
            content=test_expense["content"],
            category=test_expense["category"],
            source=test_expense["source"],
            date=timezone.now(),
            owner=user,
        )
        self.test_expense.save()

        self.response = self.client.get(
            reverse("expenses:update", kwargs={"pk": self.test_expense.pk})
        )

    def test_updatepage_contains_correct_html(self):
        self.assertContains(self.response, "Update expense:")
        self.assertContains(self.response, "Amount:")
        self.assertContains(self.response, "Content:")
        self.assertContains(self.response, "Category:")
        self.assertContains(self.response, "Source:")
        self.assertContains(self.response, "Date:")
        self.assertContains(self.response, "Save")
        self.assertContains(self.response, "Cancel")


class DeleteExpenseTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()
        self.client.force_login(user)

        expenses = test_data["expenses"]
        test_expense = expenses[0]
        self.test_expense = Expense.objects.create(
            amount=test_expense["amount"],
            content=test_expense["content"],
            category=test_expense["category"],
            source=test_expense["source"],
            date=timezone.now(),
            owner=user,
        )
        self.test_expense.save()

        self.response = self.client.get(
            reverse("expenses:delete", kwargs={"pk": self.test_expense.pk})
        )

    def test_deletepage_contains_correct_html(self):
        self.assertContains(self.response, "Delete expense:")
        self.assertContains(self.response, "Yes")
        self.assertContains(self.response, "Cancel")


class CreateBudgetTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()

        self.client.force_login(user)
        self.response = self.client.get(reverse("expenses:create_budget"))

    def test_createpage_contains_correct_html(self):
        self.assertContains(self.response, "Amount:")
        self.assertContains(self.response, "Save")
        self.assertContains(self.response, "Cancel")


class UpdateBudgetTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()

        self.client.force_login(user)

        budget = test_data["budgetData"]
        test_budget = Budget.objects.create(amount=budget["amount"], owner=user)
        test_budget.save()

        self.response = self.client.get(
            reverse("expenses:update_budget"), kwargs={"pk": test_budget.pk}
        )

    def test_updatepage_contains_correct_html(self):
        self.assertContains(self.response, "Amount:")
        self.assertContains(self.response, "Save")
        self.assertContains(self.response, "Cancel")


class DeleteBudgetTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()

        budget = test_data["budgetData"]
        test_budget = Budget.objects.create(amount=budget["amount"], owner=user)
        test_budget.save()

        self.client.force_login(user)
        self.response = self.client.get(reverse("expenses:delete_budget"))

    def test_deletepage_contains_correct_html(self):
        self.assertContains(self.response, "Delete budget:")
        self.assertContains(self.response, "Yes")
        self.assertContains(self.response, "Cancel")


class Test404Page(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()
        self.client.force_login(user)

        self.prev_debug_settings = settings.DEBUG
        settings.DEBUG = False
        self.response = self.client.get("/non-existant-url")

    def test_404page_contains_correct_html(self):
        self.assertContains(
            self.response, "The item you requested is not available. (404)"
        )

    def tearDown(self):
        settings.DEBUG = self.prev_debug_settings
