from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken


from expenses import utils

from expenses.models import Budget, Expense
from api.serializers import ExpenseSerializer, BudgetSerializer

# Create your views here.


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login_view(request):    
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
    else:
        return Response({'error': 'Invalid credentials'},
                        status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'},
                        status=status.HTTP_400_BAD_REQUEST)
    else:
        user = User.objects.create_user(username=username, password=password)
        if user:
            return Response({'detail': 'User registered successfully!'})
        else:
            return Response({'error': 'There was an issue with registering the user'})


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful."},
                        status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"message": "An error occurred during logout."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_user(request): 
    username = request.data.get('username')
    user = User.objects.filter(username=username)
    user.delete()
    return Response({'detail': 'User deleted successfully'},
                    status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_expenses(request):
    expenses = Expense.objects.filter(
        owner=request.user).order_by("-date")
    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data)

    # # Initialize the pagination
    # paginator = PageNumberPagination()
    # paginator.page_size = 10

    # # Paginate the queryset
    # paginated_queryset = paginator.paginate_queryset(expenses, request)

    # # Serialize the paginated result
    # serializer = ExpenseSerializer(paginated_queryset, many=True)

    # return paginator.get_paginated_response(serializer.data)


@api_view(['POST'])
def create_expense(request):
    expense_data = request.data
    expense_data['owner'] = request.user.pk
    serializer = ExpenseSerializer(data=expense_data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_expense(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    expense_data = {
        'owner': request.user.pk,
        'amount': request.data['amount'],
        'category': request.data['category'],
        'content': request.data['content'],
        'date': request.data['date'],
        'source': request.data['source']
    }
    serializer = ExpenseSerializer(expense, data=expense_data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_expense(request, pk):
    expense = get_object_or_404(Expense, pk=pk)
    expense.delete()
    return Response({'detail': 'Expense deleted successfully'},
                    status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_budget(request):
    budget = Budget.objects.filter(owner=request.user).first()
    if(budget):
        serializer = BudgetSerializer(budget)
        return Response(serializer.data)
    else:
        return Response({})


@api_view(['POST'])
def create_budget(request):
    budget_data = request.data
    budget_data['owner'] = request.user.pk

    serializer = BudgetSerializer(data=budget_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
def update_budget(request, pk):
    budget = get_object_or_404(Budget, pk=pk)
    budget_data = {
        'owner': request.user.pk,
        'amount': request.data['amount'],
    }
    serializer = BudgetSerializer(budget, data=budget_data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_budget(request, pk):
    budget = get_object_or_404(Budget, pk=pk)
    budget.delete()
    return Response({'detail': 'Budget deleted successfully'},
                    status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def line_chart_data(request):
    user_expenses = Expense.objects.filter(owner=request.user)
    expenses = user_expenses

    dates = [exp.date for exp in expenses]
    dates = [utils.reformat_date(date, "%d' %b") for date in dates]
    dates.reverse()

    amounts = [round(float(exp.amount), 2) for exp in expenses]
    amounts.reverse()

    chart_data = {}

    for i in range(len(dates)):
        if dates[i] not in chart_data:
            chart_data[dates[i]] = amounts[i]
        else:
            chart_data[dates[i]] += amounts[i]
    return Response(chart_data)


@api_view(['GET'])
def total_expenses_pie_chart_data(request):
    user_expenses = Expense.objects.filter(owner=request.user)

    chart_data = {}
    for exp in user_expenses:
        if exp.category not in chart_data:
            chart_data[exp.category] = float(exp.amount)
        else:
            chart_data[exp.category] += float(exp.amount)

    for category, amount in chart_data.items():
        chart_data[category] = round(amount, 2)
    return Response(chart_data)


@api_view(['GET'])
def monthly_expenses_pie_chart_data(request):
    user_expenses = Expense.objects.filter(owner=request.user)

    month_num = utils.get_month_num()
    monthly_expenses = user_expenses.filter(date__month=month_num)

    chart_data = {}
    for exp in monthly_expenses:
        if exp.category not in chart_data:
            chart_data[exp.category] = float(exp.amount)
        else:
            chart_data[exp.category] += float(exp.amount)

    for category, amount in chart_data.items():
        chart_data[category] = round(amount, 2)
    return Response(chart_data)


@api_view(['GET'])
def expenses_by_month_bar_chart_data(request):
    user_expenses = Expense.objects.filter(owner=request.user)
    current_year = utils.get_year_num()
    last_year = current_year - 1

    last_year_month_expenses = utils.get_yearly_month_expense_data(
        last_year, user_expenses
    )
    current_year_month_expenses = utils.get_yearly_month_expense_data(
        current_year, user_expenses
    )
    chart_data = {**last_year_month_expenses, **current_year_month_expenses}
    return Response(chart_data)


@api_view(['GET'])
def expenses_by_week_bar_chart_data(request):
    weeks = ["current week", "last week", "2 weeks ago", "3 weeks ago"]
    weeks.reverse()

    expenses = [
        Expense.objects.get_weekly_expense_sum(request.user),
        Expense.objects.get_weekly_expense_sum(request.user, -1),
        Expense.objects.get_weekly_expense_sum(request.user, -2),
        Expense.objects.get_weekly_expense_sum(request.user, -3),
    ]
    expenses.reverse()

    chart_data = {}
    for i, week in enumerate(weeks):
        chart_data[week] = expenses[i]
    return Response(chart_data)
