from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import redirect, render

from expenses.models import Expense

# Create your views here


def logout_view(request):
    # Delete testuser data to start from scratch when testing.
    Expense.objects.delete_testuser_expenses(request)
    Expense.objects.delete_testuser_budget(request)

    logout(request)
    return redirect('expenses:home')


def signup_view(request):
    template = 'signup.html'

    if request.method != 'POST':
        form = UserCreationForm()
    else:
        form = UserCreationForm(data=request.POST)

        if form.is_valid():
            user = form.save()
            authenticated_user = authenticate(
                username=user.username,
                password=request.POST['password1'])

            login(request, authenticated_user)
            return redirect('expenses:home')

    context = {'form': form}
    return render(request, template, context)
