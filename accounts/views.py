from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.shortcuts import redirect, render

from expenses.models import Expense

# Create your views here


def logout_view(request):
    # Delete testuser data to start from scratch when testing.
    Expense.objects.delete_testuser_expenses(request)
    Expense.objects.delete_testuser_budget(request)

    logout(request)
    return redirect("expenses:home")


def signup_view(request):
    template = "signup.html"

    if request.method != "POST":
        form = UserCreationForm()
    else:
        form = UserCreationForm(data=request.POST)
        username = form.data["username"]
        password = request.POST["password1"]

        if form.is_valid():
            form.save()
            authenticated_user = authenticate(username=username, password=password)
            login(request, authenticated_user)
            return redirect("expenses:home")
        else:
            # Form not valid, gather errors labels.
            error_labels = []
            try:
                # Check if username already exists.
                User.objects.get(username=username)
                # If so add error label.
                error_labels.append(
                    "The username you entered has already been taken! Please try another username."
                )
            except:
                pass

            # Check if passwords are not the same.
            if not form.clean_password2():
                # If they aren't add error label.
                error_labels.append("The two password fields didn’t match!")

            context = {"form": form, "errors": error_labels}
            return render(request, template, context)

    context = {"form": form}
    return render(request, template, context)
