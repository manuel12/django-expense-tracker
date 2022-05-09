from django.contrib.auth.models import User
from django.test import Client, TestCase
from django.urls import reverse
from django.urls.base import resolve
from django.utils import timezone

from accounts import views as account_views
from expenses import utils, views
from expenses.models import Budget, Expense

test_data_file = "expenses/tests/testData.json"


class LoginPageTests(TestCase):
    def setUp(self):
        self.response = self.client.get("/accounts/login/?next=/")

    def test_loginpage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_loginpage_url_name(self):
        url = reverse("accounts:login")
        self.assertEqual(url, "/accounts/login/")

    def test_loginpage_template(self):
        self.assertTemplateUsed(self.response, "registration/login.html")

    def test_loginpage_post_action(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        credentials = {
            "username": users[1]["username"],
            "password": users[1]["password"],
        }
        User.objects.create_user(
            username=users[1]["username"], password=users[1]["password"]
        )

        self.client.post(reverse("accounts:login"), credentials)
        self.assertIn("_auth_user_id", self.client.session)

    def test_loginpage_redirects_home_on_success(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        credentials = {
            "username": users[1]["username"],
            "password": users[1]["password"],
        }
        User.objects.create_user(
            username=users[1]["username"], password=users[1]["password"]
        )

        response = self.client.post(reverse("accounts:login"), credentials)
        self.assertEqual(response.url, "/")


class SingupPageTests(TestCase):
    def setUp(self):
        self.response = self.client.get("/accounts/signup/")

    def test_signuppage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_signuppage_template(self):
        self.assertTemplateUsed(self.response, "signup.html")

    def test_signuppage_url_resolves_signuppage_view(self):
        view = resolve("/accounts/signup/")
        self.assertEqual(view.func.__name__, account_views.signup_view.__name__)

    def test_signuppage_post_action(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        credentials = {
            "username": users[2]["username"],
            "password1": users[2]["password1"],
            "password2": users[2]["password2"],
        }

        self.client.post(reverse("accounts:signup"), credentials)
        self.assertEqual(User.objects.count(), 1)

    def test_signuppage_redirects_to_home_on_success(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        credentials = {
            "username": users[2]["username"],
            "password1": users[2]["password1"],
            "password2": users[2]["password2"],
        }

        response = self.client.post(reverse("accounts:signup"), credentials)
        self.assertEqual(response.url, "/")


class HomePageTests(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()

        self.client.force_login(user)
        self.response = self.client.get(reverse("expenses:home"))

    def test_redirect_if_not_logged_in(self):
        c = Client()
        response = c.get(reverse("expenses:home"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/accounts/login/?next=/")

    def test_homepage_status_code(self):
        self.response = self.client.get("http://127.0.0.1:8000/")
        self.assertEqual(self.response.status_code, 200)

    def test_homepage_url_name(self):
        url = reverse("expenses:home")
        self.assertEqual(url, "/")

    def test_homepage_template(self):
        self.assertTemplateUsed(self.response, "homepage.html")

    def test_homepage_url_resolves_homepage_view(self):
        view = resolve("/")
        self.assertEqual(view.func.__name__, views.homepage.__name__)


class CreateExpenseTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        self.user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        self.user.save()

        self.client.force_login(self.user)
        self.response = self.client.get(reverse("expenses:create"))

    def test_redirect_if_not_logged_in(self):
        c = Client()
        response = c.get(reverse("expenses:create"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/accounts/login/?next=/create/")

    def test_createpage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_createpage_url_name(self):
        url = reverse("expenses:create")
        self.assertEqual(url, "/create/")

    def test_createpage_template(self):
        self.assertTemplateUsed(self.response, "create_expense.html")

    def test_createpage_url_resolves_homepage_view(self):
        view = resolve("/create/")
        self.assertEqual(view.func.__name__, views.create_expense.__name__)

    def test_createpage_post_action(self):
        test_data = utils.get_data_from_json(test_data_file)
        expenses = test_data["expenses"]
        test_expense = expenses[0]
        time_of_post = timezone.now()

        response = self.client.post(
            reverse("expenses:create"),
            {
                "amount": test_expense["amount"],
                "content": test_expense["content"],
                "category": test_expense["category"],
                "source": test_expense["source"],
                "owner": self.user,
                "date": time_of_post,
            },
        )
        self.assertEqual(response.status_code, 302)

        new_expense = Expense.objects.first()
        self.assertEqual(test_expense["amount"], new_expense.amount)
        self.assertEqual(test_expense["content"], new_expense.content)
        self.assertEqual(test_expense["category"], new_expense.category)
        self.assertEqual(test_expense["source"], new_expense.source)
        self.assertEqual(time_of_post, new_expense.date)

    def test_redirect_to_home_on_success(self):
        test_data = utils.get_data_from_json(test_data_file)
        expenses = test_data["expenses"]
        test_expense = expenses[0]
        time_of_post = timezone.now()

        response = self.client.post(
            reverse("expenses:create"),
            {
                "amount": test_expense["amount"],
                "content": test_expense["content"],
                "category": test_expense["category"],
                "source": test_expense["source"],
                "owner": self.user,
                "date": time_of_post,
            },
        )
        self.assertEqual(response.url, "/")


class UpdateExpenseTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        self.user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        self.user.save()

        expenses = test_data["expenses"]
        test_expense = expenses[0]
        self.test_updated_expense = test_data["updatedExpenseData"]

        self.test_expense = Expense.objects.create(
            amount=test_expense["amount"],
            content=test_expense["content"],
            category=test_expense["category"],
            source=test_expense["source"],
            date=timezone.now(),
            owner=self.user,
        )
        self.test_expense.save()

        self.client.force_login(self.user)
        self.response = self.client.get(
            reverse("expenses:update", kwargs={"pk": self.test_expense.pk})
        )

    def test_redirect_if_not_logged_in(self):
        c = Client()
        response = c.get(
            reverse("expenses:update", kwargs={"pk": self.test_expense.pk})
        )
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/accounts/login/?next=/update/1/")

    def test_updatepage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_updatepage_url_name(self):
        url = reverse("expenses:update", args=[1])
        self.assertEqual(url, "/update/1/")

    def test_updatepage_template(self):
        self.assertTemplateUsed(self.response, "update_expense.html")

    def test_updatepage_url_resolves_homepage_view(self):
        view = resolve("/update/1/")
        self.assertEqual(view.func.__name__, views.update_expense.__name__)

    def test_updatepage_post_action(self):
        response = self.client.post(
            reverse("expenses:update", kwargs={"pk": self.test_expense.pk}),
            {
                "amount": self.test_updated_expense["amount"],
                "content": self.test_expense.content,
                "category": self.test_expense.category,
                "source": self.test_expense.source,
                "owner": self.user,
                "date": timezone.now(),
            },
        )
        self.test_expense.refresh_from_db()
        self.assertEqual(response.status_code, 302)
        self.assertEqual(self.test_expense.amount, self.test_updated_expense["amount"])

    def test_redirect_to_home_on_success(self):
        response = self.client.post(
            reverse("expenses:update", kwargs={"pk": self.test_expense.pk}),
            {
                "amount": self.test_updated_expense["amount"],
                "content": self.test_expense.content,
                "category": self.test_expense.category,
                "source": self.test_expense.source,
                "owner": self.user,
                "date": timezone.now(),
            },
        )
        self.assertEqual(response.url, "/")


class DeleteExpenseTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        user.save()

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

        self.client.force_login(user)
        self.response = self.client.get(
            reverse("expenses:delete", kwargs={"pk": self.test_expense.pk})
        )

    def test_redirect_if_not_logged_in(self):
        c = Client()
        response = c.get(
            reverse("expenses:delete", kwargs={"pk": self.test_expense.pk})
        )
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/accounts/login/?next=/delete/1/")

    def test_deletepage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_deletepage_url_name(self):
        url = reverse("expenses:delete", args=[2])
        self.assertEqual(url, "/delete/2/")

    def test_deletepage_template(self):
        self.assertTemplateUsed(self.response, "delete_expense.html")

    def test_deletepage_url_resolves_deletepage_view(self):
        view = resolve("/delete/1/")
        self.assertEqual(view.func.__name__, views.delete_expense.__name__)

    def test_deletepage_post_action(self):
        response = self.client.post(
            reverse("expenses:delete", kwargs={"pk": self.test_expense.pk})
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(Expense.objects.count(), 0)

    def test_redirect_to_home_on_success(self):
        response = self.client.post(
            reverse("expenses:delete", kwargs={"pk": self.test_expense.pk})
        )
        self.assertEqual(response.url, "/")


class CreateBudgetTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        self.user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        self.user.save()

        self.budget = test_data["budgetData"]

        self.client.force_login(self.user)
        self.response = self.client.get(reverse("expenses:create_budget"))

    def test_redirect_if_not_logged_in(self):
        c = Client()
        response = c.get(reverse("expenses:create_budget"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/accounts/login/?next=/create-budget/")

    def test_create_budgetpage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_create_budgetpage_url_name(self):
        url = reverse("expenses:create_budget")
        self.assertEqual(url, "/create-budget/")

    def test_create_budgetpage_template(self):
        self.assertTemplateUsed(self.response, "create_budget.html")

    def test_create_budgetpage_url_resolves_create_budgetpage_view(self):
        view = resolve("/create-budget/")
        self.assertEqual(view.func.__name__, views.create_budget.__name__)

    def test_create_budgetpage_post_action(self):

        self.client.post(
            reverse("expenses:create_budget"),
            {"amount": self.budget["amount"], "owner": self.user},
        )

        self.assertEqual(Budget.objects.count(), 1)

    def test_redirect_to_home_on_success(self):
        response = self.client.post(
            reverse("expenses:create_budget"),
            {"amount": self.budget["amount"], "owner": self.user},
        )

        self.assertEqual(response.url, "/")


class UpdateBudgetTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        self.user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        self.user.save()
        self.client.force_login(self.user)

        test_budget = test_data["budgetData"]
        self.updated_test_budget = test_data["updatedBudgetData"]

        self.test_budget = Budget.objects.create(
            amount=test_budget["amount"], owner=self.user
        )
        self.test_budget.save()

        self.response = self.client.get(
            reverse("expenses:update_budget"), kwargs={"pk": self.test_budget.pk}
        )

    def test_redirect_if_not_logged_in(self):
        c = Client()
        response = c.get(reverse("expenses:update_budget"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/accounts/login/?next=/update-budget/")

    def test_update_budgetpage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_update_budgetpage_url_name(self):
        url = reverse("expenses:update_budget")
        self.assertEqual(url, "/update-budget/")

    def test_update_budgetpage_template(self):
        self.assertTemplateUsed(self.response, "update_budget.html")

    def test_update_budgetpage_url_resolves_update_budgetpage_view(self):
        view = resolve("/update-budget/")
        self.assertEqual(view.func.__name__, views.update_budget.__name__)

    def test_update_budgetpage_post_action(self):
        self.client.post(
            reverse("expenses:update_budget"),
            {"amount": self.updated_test_budget["amount"], "owner": self.user},
        )

        self.test_budget.refresh_from_db()
        self.assertEqual(self.test_budget.amount, self.updated_test_budget["amount"])

    def test_redirect_to_home_on_success(self):
        response = self.client.post(
            reverse("expenses:update_budget"),
            {"amount": self.updated_test_budget["amount"], "owner": self.user},
        )

        self.assertEqual(response.url, "/")


class DeleteBudgetTest(TestCase):
    def setUp(self):
        test_data = utils.get_data_from_json(test_data_file)
        users = test_data["testusers"]

        self.user = User.objects.create_user(
            username=users[0]["username"], password=users[0]["password"]
        )
        self.user.save()
        test_budget = test_data["budgetData"]

        self.test_budget = Budget.objects.create(
            amount=test_budget["amount"], owner=self.user
        )
        self.test_budget.save()

        self.client.force_login(self.user)
        self.response = self.client.get(reverse("expenses:delete_budget"))

    def test_redirect_if_not_logged_in(self):
        c = Client()
        response = c.get(reverse("expenses:delete_budget"))
        self.assertEqual(response.status_code, 302)
        self.assertRedirects(response, "/accounts/login/?next=/delete-budget/")

    def test_delete_budgetpage_status_code(self):
        self.assertEqual(self.response.status_code, 200)

    def test_delete_budgetpage_url_name(self):
        url = reverse("expenses:delete_budget")
        self.assertEqual(url, "/delete-budget/")

    def test_delete_budgetpage_template(self):
        self.assertTemplateUsed(self.response, "delete_budget.html")

    def test_delete_budgetpage_url_resolves_deletepage_view(self):
        view = resolve("/delete-budget/")
        self.assertEqual(view.func.__name__, views.delete_budget.__name__)

    def test_delete_budgetpage_post_action(self):
        self.client.post(reverse("expenses:delete_budget"))
        self.assertEqual(Budget.objects.count(), 0)

    def test_redirect_to_home_on_success(self):
        response = self.client.post(reverse("expenses:delete_budget"))
        self.assertEqual(response.url, "/")
