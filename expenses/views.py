import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from expenses import utils

from .forms import BudgetForm, ExpenseForm
from .models import Budget, Expense

# Create your views here.


def home(request):
    return render(request, "build/index.html")

# @login_required
# def homepage(request):
#     # Add expenses to testuser to showcase expense and statistics tables
#     # and charts.
#     Expense.objects.add_testuser_expenses(request)

#     template = "homepage.html"
#     user_expenses = Expense.objects.filter(
#         owner=request.user).order_by("-date")

#     total_expense_amount = Expense.objects.get_total_expenses(
#         owner=request.user)
#     budget = Expense.objects.get_budget(owner=request.user)

#     page = request.GET.get("page", 1)
#     paginator = Paginator(user_expenses, 15)

#     try:
#         expenses = paginator.page(page)
#     except PageNotAnInteger:
#         expenses = paginator.page(1)
#     except EmptyPage:
#         expenses = paginator.page(paginator.num_pages)

#     pagination_range_down = expenses.number - 5
#     pagination_range_up = expenses.number + 5

#     context = {
#         "expenses": expenses,
#         "total_expense_amount": total_expense_amount,
#         "budget": budget,
#         "num_expenses": len(user_expenses),
#         "num_pages": paginator.num_pages,
#         "pagination_range_down": pagination_range_down,
#         "pagination_range_up": pagination_range_up,
#     }

#     if budget:
#         current_month_expenses = Expense.objects.get_monthly_expense_sum(
#             owner=request.user
#         )
#         expenses_vs_budget_percentage_diff = (
#             (current_month_expenses / budget * 100) if budget else 0
#         )
#         amount_over_budget = current_month_expenses - budget

#         context["current_month_expenses"] = current_month_expenses
#         context[
#             "expenses_vs_budget_percentage_diff"
#         ] = expenses_vs_budget_percentage_diff
#         context["amount_over_budget"] = amount_over_budget

#     return render(request, template, context)


# @login_required
# def charts(request):
#     template = "charts.html"
#     expenses = Expense.objects.filter(owner=request.user)
#     budget = Expense.objects.get_budget(request.user)
#     statistics = Expense.objects.get_statistics(request.user)

#     context = {"expenses": expenses,
#                "budget": budget, "statistics": statistics}
#     return render(request, template, context)


# @login_required
# def create_expense(request):
#     template = "create_expense.html"

#     if request.method != "POST":
#         # No data submitted; create a blank form.
#         form = ExpenseForm()
#     else:
#         # POST data submitted; process data.
#         form = ExpenseForm(request.POST)
#         if form.is_valid():
#             new_expense = form.save(commit=False)
#             new_expense.owner = request.user
#             new_expense.save()
#             return redirect("expenses:home")

#     context = locals()
#     return render(request, template, context)


# @login_required
# def view_expense(request, pk):
#     template = "view_expense.html"
#     expense = get_object_or_404(Expense, pk=pk)
#     context = locals()

#     return render(request, template, context)


# @login_required
# def update_expense(request, pk):
#     template = "update_expense.html"
#     expense = get_object_or_404(Expense, pk=pk)

#     if request.method != "POST":
#         form = ExpenseForm(instance=expense)

#     else:
#         form = ExpenseForm(instance=expense, data=request.POST)
#         if form.is_valid():
#             form.save()
#             return redirect("expenses:home")

#     context = locals()
#     return render(request, template, context)


# @login_required
# def delete_expense(request, pk):
#     template = "delete_expense.html"
#     expense = get_object_or_404(Expense, pk=pk)

#     if request.method == "POST":
#         expense.delete()
#         return redirect("expenses:home")

#     return render(request, template, {})


# @login_required
# def create_budget(request):
#     template = "create_budget.html"

#     if request.method != "POST":
#         # No data submitted; create a blank form.
#         form = BudgetForm()
#     else:
#         # POST data submitted; process data.
#         form = BudgetForm(request.POST)
#         if form.is_valid():
#             new_budget = form.save(commit=False)
#             new_budget.owner = request.user
#             new_budget.save()
#             return redirect("expenses:home")

#     context = locals()
#     return render(request, template, context)


# @login_required
# def update_budget(request):
#     template = "update_budget.html"
#     budget = get_object_or_404(Budget, owner=request.user)

#     if request.method != "POST":
#         form = BudgetForm(instance=budget)

#     else:
#         form = BudgetForm(instance=budget, data=request.POST)
#         if form.is_valid():
#             updated_budget = form.save(commit=False)
#             updated_budget.owner = request.user
#             updated_budget.save()
#             return redirect("expenses:home")

#     context = locals()
#     return render(request, template, context)


# @login_required
# def delete_budget(request):
#     template = "delete_budget.html"
#     budget = get_object_or_404(Budget, owner=request.user)

#     if request.method == "POST":
#         budget.delete()
#         return redirect("expenses:home")

#     return render(request, template, {})


# @login_required
# def view_404(request, exception):
#     template = "errors/404.html"
#     return render(request, template, {})


# @login_required
# def view_500(request):
#     template = "errors/500.html"
#     return render(request, template, {})


# @login_required
# def expense_table_data(request):
#     user_expenses = Expense.objects.filter(owner=request.user)[:5]
#     expenses_data = []

#     for expense in user_expenses:
#         new_expense = {
#             'amount': float(expense.amount),
#             'content': expense.content,
#             'category': expense.category,
#             'source': expense.source,
#             'date': str(expense.date),

#         }
#         expenses_data.append(new_expense)

#     return JsonResponse({'expenses': expenses_data})


# @login_required
# def statistics_table_data(request):
#     statistics = Expense.objects.get_statistics(request.user)
#     print(statistics['max_expense'].amount)
#     stats = {
#         "sum_expense": float(statistics['sum_expense']),
#         'max_expense': float(statistics['max_expense'].amount),
#         "max_expense_content": statistics['max_expense_content'],
#         "min_expense": float(statistics['min_expense'].amount),
#         "min_expense_content": statistics['min_expense_content'],
#         "biggest_category_expenditure": statistics['biggest_category_expenditure'],
#         "smallest_category_expenditure": statistics['smallest_category_expenditure'],
#         "monthly_percentage_diff": float(statistics['monthly_percentage_diff']),
#         "monthly_expense_average": float(statistics['monthly_expense_average']),
#         "daily_expense_average": float(statistics['daily_expense_average']),
#         "curr_month_expense_sum": float(statistics['curr_month_expense_sum']),
#         "one_month_ago_expense_sum": float(statistics['one_month_ago_expense_sum']),
#     }
#     return JsonResponse(stats)


# @login_required
# def line_chart_data(request):
#     user_expenses = Expense.objects.filter(owner=request.user)

#     page = request.GET.get("page", 1)
#     paginator = Paginator(user_expenses, 15)

#     try:
#         expenses = paginator.page(page)
#     except PageNotAnInteger:
#         expenses = paginator.page(1)
#     except EmptyPage:
#         expenses = paginator.page(paginator.num_pages)

#     dates = [exp.date for exp in expenses]
#     dates = [utils.reformat_date(date, "%d' %b") for date in dates]
#     dates.reverse()

#     amounts = [round(float(exp.amount), 2) for exp in expenses]
#     amounts.reverse()

#     chart_data = {}

#     for i in range(len(dates)):
#         if dates[i] not in chart_data:
#             chart_data[dates[i]] = amounts[i]
#         else:
#             chart_data[dates[i]] += amounts[i]
#     return JsonResponse(chart_data)


# @login_required
# def total_expenses_pie_chart_data(request):
#     user_expenses = Expense.objects.filter(owner=request.user)

#     chart_data = {}
#     for exp in user_expenses:
#         if exp.category not in chart_data:
#             chart_data[exp.category] = float(exp.amount)
#         else:
#             chart_data[exp.category] += float(exp.amount)

#     for category, amount in chart_data.items():
#         chart_data[category] = round(amount, 2)
#     return JsonResponse(chart_data)


# @login_required
# def monthly_expenses_pie_chart_data(request):
#     user_expenses = Expense.objects.filter(owner=request.user)

#     month_num = utils.get_month_num()
#     monthly_expenses = user_expenses.filter(date__month=month_num)

#     chart_data = {}
#     for exp in monthly_expenses:
#         if exp.category not in chart_data:
#             chart_data[exp.category] = float(exp.amount)
#         else:
#             chart_data[exp.category] += float(exp.amount)

#     for category, amount in chart_data.items():
#         chart_data[category] = round(amount, 2)
#     return JsonResponse(chart_data)


# @login_required
# def expenses_by_month_bar_chart_data(request):
#     user_expenses = Expense.objects.filter(owner=request.user)
#     current_year = utils.get_year_num()
#     last_year = current_year - 1

#     last_year_month_expenses = utils.get_yearly_month_expense_data(
#         last_year, user_expenses
#     )
#     current_year_month_expenses = utils.get_yearly_month_expense_data(
#         current_year, user_expenses
#     )
#     chart_data = {**last_year_month_expenses, **current_year_month_expenses}
#     return JsonResponse(chart_data)


# @login_required
# def expenses_by_week_bar_chart_data(request):
#     weeks = ["current week", "last week", "2 weeks ago", "3 weeks ago"]
#     weeks.reverse()

#     expenses = [
#         Expense.objects.get_weekly_expense_sum(request.user),
#         Expense.objects.get_weekly_expense_sum(request.user, -1),
#         Expense.objects.get_weekly_expense_sum(request.user, -2),
#         Expense.objects.get_weekly_expense_sum(request.user, -3),
#     ]
#     expenses.reverse()

#     chart_data = {}
#     for i, week in enumerate(weeks):
#         chart_data[week] = expenses[i]
#     return JsonResponse(chart_data)


# @login_required
# def add_testuser_data(request):
#     user = str(request.user)
#     if user == "testuser1" or user == "testuser3":
#         req_post_dict = dict(request.POST)
#         expenses_str_dict = req_post_dict["expenses"][0]
#         expenses = json.loads(expenses_str_dict)

#         Expense.objects.create_test_expenses(request.user, expenses)
#         return redirect("expenses:home")


# @login_required
# def delete_testuser_data(request):
#     """Function to remove all data from testusers that can be access via url by tests."""
#     user = str(request.user)

#     if user == "testuser1" or user == "testuser3":
#         Expense.objects.delete_testuser_expenses(request)
#         Expense.objects.delete_testuser_budget(request)

#         testusers_to_delete = User.objects.exclude(username="testuser1").exclude(
#             username="testuser3"
#         )
#         testusers_to_delete.delete()

#         return redirect("expenses:home")
#     else:
#         print(
#             "Not allowed to delete the expenses or budget of any user other than testuser1 and testuser3"
#         )
#         return redirect("expenses:home")
