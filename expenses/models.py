from decimal import Decimal

from django.contrib.auth.models import User
from django.core.validators import MinValueValidator
from django.db import models
from django.db.models import Sum
from django.urls import reverse
from django.utils import timezone

from expenses import utils

# Create your models here.


class ExpenseManager(models.Manager):
    def add_testuser_expenses(self, request):
        if str(request.user) == "testuser1":
            test_user_expenses = Expense.objects.filter(owner=request.user)

            if not test_user_expenses:
                Expense.objects.create_test_expenses(request.user)

    def create_test_expenses(self, owner, expenses=None):
        if expenses:
            expenses = expenses
        else:
            expenses_by_date = utils.get_data_from_json(
                "expenses/data/expensesByDate.json"
            )
            eg = utils.ExpenseGenerator(expenses_by_date)
            expenses = eg.generate_expenses()

        for expense in expenses:
            exp = self.model(
                amount=expense["amount"],
                content=expense["content"],
                category=expense["category"],
                source=expense["source"],
                date=expense["date"],
                owner=owner,
            )
            exp.save()

    def delete_testuser_expenses(self, request):
        if str(request.user) == "testuser1" or str(request.user) == "testuser3":

            test_user_expenses = Expense.objects.filter(owner=request.user)
            for expense in test_user_expenses:
                expense.delete()

    def delete_testuser_budget(self, request):
        if str(request.user) == "testuser1" or str(request.user) == "testuser3":
            test_user_budget = Budget.objects.all()
            test_user_budget.delete()

    def get_user_expenses(self, owner):
        return Expense.objects.filter(owner=owner)

    def get_total_expenses(self, owner):
        total_expenses = self.get_user_expenses(owner).aggregate(amount=Sum("amount"))[
            "amount"
        ]
        return utils.safely_round(total_expenses)

    def get_max_expense(self, owner):
        """Returns the user's highest."""
        max_expense = self.get_user_expenses(owner).order_by("amount").last()
        return max_expense

    def get_max_expense_content(self, owner):
        """Returns the content of the user's highest expense."""
        max_expense = self.get_user_expenses(owner).order_by("amount").last()
        return max_expense.content if max_expense else "There are no expenses yet."

    def get_min_expense(self, owner):
        """Returns the user's lowest expense."""
        min_expense = self.get_user_expenses(owner).order_by("amount").first()
        return min_expense

    def get_min_expense_content(self, owner):
        """Returns the content of the user's lowest expense."""
        min_expense = self.get_user_expenses(owner).order_by("amount").first()
        return min_expense.content if min_expense else "There are no expenses yet."

    def get_weekly_expense_sum(self, owner, week_timedelta_num=0):
        """
        Returns the total expenses for the given week.

        Passing week_timedelta_num will add or substract to current week,
        so week_timedelta_num=0(current week), week_timedelta_num=1(next week),
        week_timedelta_num=-1(last week), and so on.
        """
        current_week_num = utils.get_week_iso_num(week_timedelta_num)
        weekly_expenses = self.get_user_expenses(owner).filter(
            date__week=current_week_num
        )
        weekly_expenses = weekly_expenses.aggregate(
            amount=Sum("amount"))["amount"]
        return utils.safely_round(weekly_expenses)

    def get_monthly_expense_sum(self, owner, month_timedelta_num=0):
        """
        Returns the total expenses for the given month.

        A month_timedelta_num will add or substract to current month,
        so month_timedelta_num=0(current month) month_timedelta_num=1(next month),
        month_timedelta_num=-1(last month), and so on.
        """
        current_month_num = utils.get_month_num(month_timedelta_num)
        current_month_num = 12 if current_month_num < 1 else current_month_num

        monthly_expenses = self.get_user_expenses(owner).filter(
            date__month=current_month_num
        )
        monthly_expenses = monthly_expenses.aggregate(
            amount=Sum("amount"))["amount"]
        return utils.safely_round(monthly_expenses)

    def get_monthly_expense_average(self, owner):
        months = utils.get_months_list()
        monthly_expenses_data = []

        for month in months:
            month_num = months.index(month) + 1
            monthly_expenses = self.get_user_expenses(owner).filter(
                date__month=month_num
            )

            if monthly_expenses:
                monthly_expenses_sum = round(
                    monthly_expenses.aggregate(amount=Sum("amount"))[
                        "amount"], 2
                )
                monthly_expenses_data.append(monthly_expenses_sum)

        if monthly_expenses_data:
            monthly_expense_average = round(
                sum(monthly_expenses_data) / len(monthly_expenses_data), 2
            )
        else:
            monthly_expense_average = 0
        return monthly_expense_average

    def get_expense_amounts_by_category(self, owner):
        expense_amounts_by_category = {}
        for exp in self.get_user_expenses(owner):
            if exp.category not in expense_amounts_by_category:
                expense_amounts_by_category[exp.category] = float(exp.amount)
            else:
                expense_amounts_by_category[exp.category] += float(exp.amount)
        return expense_amounts_by_category

    def get_biggest_category_expenditure(self, owner):
        """
        Returns a dictionary with both the amount and the category
        of the user's highest expense.
        """
        expense_amounts_by_category = self.get_expense_amounts_by_category(
            owner)
        if expense_amounts_by_category:
            biggest_category_expense = max(
                expense_amounts_by_category.values())
            biggest_category = [
                cat
                for (cat, amount) in expense_amounts_by_category.items()
                if amount == biggest_category_expense
            ][0]
            biggest_category_expense = round(biggest_category_expense, 2)
        else:
            biggest_category = ("No expenses",)
            biggest_category_expense = 0

        return {"category": biggest_category, "amount": biggest_category_expense}

    def get_smallest_category_expenditure(self, owner):
        """
        Returns a dictionary with both the amount and the category
        of the user's lowest expense.
        """
        expense_amounts_by_category = self.get_expense_amounts_by_category(
            owner)
        if expense_amounts_by_category:
            smallest_category_expense = min(
                expense_amounts_by_category.values())
            smallest_category = [
                cat
                for (cat, amount) in expense_amounts_by_category.items()
                if amount == smallest_category_expense
            ][0]
            smallest_category_expense = round(smallest_category_expense, 2)
        else:
            smallest_category = ("No expenses",)
            smallest_category_expense = 0

        return {"category": smallest_category, "amount": smallest_category_expense}

    def get_curr_and_last_month_expenses_percentage_diff(self, owner):
        """
        Returns the percentage difference between the current month
        and the last months expenses.
        """
        curr_month_expenses = self.get_monthly_expense_sum(owner)
        one_month_ago_expenses = self.get_monthly_expense_sum(owner, -1)
        percentage_diff = utils.get_percentage_diff(
            curr_month_expenses, one_month_ago_expenses
        )
        return percentage_diff

    def get_daily_expense_average(self, owner):
        expenses = Expense.objects.filter(owner=owner).values("date", "amount")

        date_and_amount_data = {}
        for exp in expenses:
            if exp["date"] not in date_and_amount_data:
                date_and_amount_data[exp["date"]] = exp["amount"]
            else:
                date_and_amount_data[exp["date"]] += exp["amount"]

        if date_and_amount_data:
            daily_expense_average = round(
                sum(date_and_amount_data.values()) /
                len(date_and_amount_data.values()),
                2,
            )
        else:
            daily_expense_average = 0
        return daily_expense_average

    def get_statistics(self, owner):
        statistics = {
            "sum_expense": self.get_total_expenses(owner),
            "max_expense": self.get_max_expense(owner),
            "max_expense_content": self.get_max_expense_content(owner),
            "min_expense": self.get_min_expense(owner),
            "min_expense_content": self.get_min_expense_content(owner),
            "biggest_category_expenditure": self.get_biggest_category_expenditure(
                owner
            ),
            "smallest_category_expenditure": self.get_smallest_category_expenditure(
                owner
            ),
            "monthly_percentage_diff": self.get_curr_and_last_month_expenses_percentage_diff(
                owner
            ),
            "monthly_expense_average": self.get_monthly_expense_average(owner),
            "daily_expense_average": self.get_daily_expense_average(owner),
            "curr_month_expense_sum": self.get_monthly_expense_sum(owner),
            "one_month_ago_expense_sum": self.get_monthly_expense_sum(owner, -1),
        }
        return statistics

    def get_budget(self, owner):
        budget = Budget.objects.filter(owner=owner).first()
        return budget.amount if budget else 0


class Expense(models.Model):
    amount = models.DecimalField(
        blank=False,
        default=10,
        decimal_places=2,
        max_digits=10,
        validators=[MinValueValidator(Decimal("0.01")), ]

    )
    content = models.CharField(max_length=100, blank=False)

    CATEGORY_CHOICES = (
        ("Bar tabs", "Bar tabs"),
        ("Monthly bill", "Monthly bill"),
        ("Online shopping", "Online shopping"),
        ("Electronics", "Electronics"),
        ("Groceries", "Groceries"),
        ("Taxi fare", "Taxi fare"),
        ("Miscellaneous", "Miscellaneous"),
    )
    category = models.CharField(
        max_length=20, choices=CATEGORY_CHOICES, null=True, blank=False)
    source = models.CharField(max_length=30, blank=False)
    date = models.DateTimeField(default=timezone.now, blank=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)

    objects = ExpenseManager()

    def __str__(self):
        return str(self.amount)

    def get_date_without_time(self):
        date_without_time = utils.reformat_date(self.date, "%Y-%m-%d")
        return date_without_time

    class Meta:
        ordering = ["-date"]


class Budget(models.Model):
    amount = models.DecimalField(
        default=10,
        decimal_places=2,
        max_digits=5,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.amount)
