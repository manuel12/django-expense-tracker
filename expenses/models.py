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
        if str(request.user) == 'testuser3':
            test_user_expenses = Expense.objects.filter(owner=request.user).order_by('-date')

            if not test_user_expenses:
                Expense.objects.create_test_expenses(request.user)


    def delete_testuser_expenses(self, request):
        if str(request.user) == 'testuser1' or \
            str(request.user) == 'testuser3':

            test_user_expenses = Expense.objects.filter(owner=request.user)
            for expense in test_user_expenses:
                expense.delete()

    def create_test_expenses(self, owner):
        expenses_by_date = utils.read_from_json('expenses/expensesByDate.json')
        eg = utils.ExpenseGenerator(expenses_by_date)
        expenses = eg.generate_expenses()

        for expense in expenses:
            exp = self.model(
              amount=expense['amount'],
              content=expense['content'],
              category=expense['category'],
              source=expense['source'],
              date=expense['date'],
              owner=owner
            )
            exp.save()

    def _get_user_expenses(self, owner):
        return Expense.objects.filter(owner=owner)

    def get_total_expenses(self, owner):
        total_expenses = self._get_user_expenses(owner).aggregate(
                                    amount=Sum('amount'))['amount']
        return utils.get_fallback_if_none(total_expenses, 0)

    def get_max_expense(self, owner):
        max_expense = self._get_user_expenses(owner).order_by('amount').last()
        return max_expense

    def get_max_expense_content(self, owner):
        max_expense = self._get_user_expenses(owner).order_by('amount').last()
        return max_expense.content if max_expense else "There are no expenses yet."

    def get_min_expense(self, owner):
        min_expense = self._get_user_expenses(owner).order_by('amount').first()
        return min_expense

    def get_min_expense_content(self, owner):
        min_expense = self._get_user_expenses(owner).order_by('amount').first()
        return min_expense.content if min_expense else "There are no expenses yet."

    def get_weekly_expense_sum(self, owner, week_num=0):
        """
        week_num will add or substract to current week,
        so week_num=0(current week), week_num=1(next week),
        week_num=-1(last week), and so on.
        """

        current_week_num = utils.get_current_date_num('week')
        weekly_expenses = self._get_user_expenses(owner).filter(
                                    date__week=current_week_num + week_num)
        weekly_expenses = weekly_expenses.aggregate(
                                    amount=Sum('amount'))['amount']
        return utils.get_fallback_if_none(weekly_expenses, 0)

    def get_monthly_expense_sum(self, owner, month_num=0):
        """
        A month_num will add or substract to current month,
        so month_num=0(current month) month_num=1(next month),
        month_num=-1(last month), and so on.
        """

        current_month_num = utils.get_current_date_num('month') # Jan=1, Feb=2, etc.
        monthly_expenses = self._get_user_expenses(owner).filter(
                                    date__month=current_month_num + month_num)
        monthly_expenses = monthly_expenses.aggregate(
                                    amount=Sum('amount'))['amount']
        return utils.get_fallback_if_none(monthly_expenses, 0)

    def get_monthly_expense_average(self, owner):
        months = utils.get_months_list()
        monthly_expenses_data = []

        for month in months:
            month_num = months.index(month) + 1
            monthly_expenses = self._get_user_expenses(owner).filter(date__month=month_num)

            if monthly_expenses:
                monthly_expenses_sum = round(monthly_expenses.aggregate(
                                    amount=Sum('amount'))['amount'], 2)
                monthly_expenses_data.append(monthly_expenses_sum)
        
        if monthly_expenses_data:
            monthly_expense_average = round(sum(monthly_expenses_data) / len(monthly_expenses_data), 2)
        else:
            monthly_expense_average = 0
        return monthly_expense_average 

    def get_expense_amounts_by_category(self, owner):
        category_data = {}
        for exp in self._get_user_expenses(owner):
            if exp.category not in category_data:
                category_data[exp.category] = float(exp.amount)
            else:
                category_data[exp.category] += float(exp.amount)
        return category_data 

    def get_biggest_category_expenditure(self, owner):
        category_data = self.get_expense_amounts_by_category(owner)
        if(category_data):
            biggest_category_expense = max(category_data.values())
            biggest_category = [cat for (cat, amount) in category_data.items() 
                                if amount == biggest_category_expense][0]
            biggest_category_expense = round(biggest_category_expense, 2)
        else:
          biggest_category = 'No expenses',
          biggest_category_expense = 0
        
        return {  
          'category': biggest_category,
          'amount': biggest_category_expense
        }

    def get_smallest_category_expenditure(self, owner):
        category_data = self.get_expense_amounts_by_category(owner)
        if(category_data):
            smallest_category_expense = min(category_data.values())
            smallest_category = [cat for (cat, amount) in category_data.items() 
                                if amount == smallest_category_expense][0]
            smallest_category_expense = round(smallest_category_expense, 2)
        else:
            smallest_category = 'No expenses',
            smallest_category_expense = 0
        
        return {  
          'category': smallest_category,
          'amount': smallest_category_expense
        }

    def get_monthly_expense_percentage_diff(self, owner):
        curr_month_expenses = self.get_monthly_expense_sum(owner)
        one_month_ago_expenses = self.get_monthly_expense_sum(owner, -1)
        percentage_diff = utils.get_percentage(curr_month_expenses, one_month_ago_expenses)
        return percentage_diff

    def get_daily_expense_average(self, owner):
        expenses = Expense.objects.filter(owner=owner).values('date', 'amount')

        date_and_amount_data = {}
        for exp in expenses:
          if exp['date'] not in date_and_amount_data:
            date_and_amount_data[exp['date']] = exp['amount']
          else:
            date_and_amount_data[exp['date']] += exp['amount']

        if date_and_amount_data:
            daily_expense_average = round(sum(date_and_amount_data.values()) / len(date_and_amount_data.values()), 2)
        else:
            daily_expense_average = 0
        return daily_expense_average

    def get_statistics(self, owner):
        statistics = {
            'sum_expense':                   self.get_total_expenses(owner),
            'max_expense':                   self.get_max_expense(owner),
            'max_expense_content':           self.get_max_expense_content(owner),
            'min_expense':                   self.get_min_expense(owner),
            'min_expense_content':           self.get_min_expense_content(owner),
            'biggest_category_expenditure':  self.get_biggest_category_expenditure(owner),
            'smallest_category_expenditure': self.get_smallest_category_expenditure(owner),
            'monthly_percentage_diff':       self.get_monthly_expense_percentage_diff(owner),
            'monthly_expense_average':       self.get_monthly_expense_average(owner),
            'daily_expense_average':         self.get_daily_expense_average(owner),
            'curr_month_expense_sum':        self.get_monthly_expense_sum(owner),
            'one_month_ago_expense_sum':     self.get_monthly_expense_sum(owner, -1)
        }
        return statistics

    def get_budget(self, owner):
        budget = Budget.objects.filter(owner=owner).first()
        return budget.amount if budget else 0


class Expense(models.Model):
    amount = models.DecimalField(
        default=10, decimal_places=2,
        max_digits=10, validators=[MinValueValidator(Decimal('0.01'))])
    content = models.CharField(max_length=100, blank=False)

    CATEGORY_CHOICES = (
        ('Bar tabs', 'Bar tabs'),
        ('Monthly bill', 'Monthly bill'),
        ('Online shopping', 'Online shopping'),
        ('Electronics', 'Electronics'),
        ('Groceries', 'Groceries'),
        ('Taxi fare', 'Taxi fare'),
        ('Miscellaneous', 'Miscellaneous')
    )
    category = models.CharField(
            max_length=20,
            choices=CATEGORY_CHOICES,
            null=True
    )
    source  = models.CharField(max_length=30, blank=False)
    date    = models.DateTimeField(default=timezone.now)
    owner   = models.ForeignKey(User, on_delete=models.CASCADE)

    objects = ExpenseManager()

    def __str__(self):
        return str(self.amount)

    def get_absolute_url(self):
        return reverse('expenses:view', kwargs={'pk': self.pk})
    
    def get_date_without_time(self):
        date_without_time = utils.reformat_date(self.date, "%Y-%m-%d")
        return date_without_time

    class Meta:
        ordering = ['-date']


class Budget(models.Model):
    amount = models.DecimalField(
        default=10, decimal_places=2, max_digits=5,
        validators=[MinValueValidator(Decimal('0.01'))])
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.amount)
