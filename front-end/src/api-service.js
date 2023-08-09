const apiUrl = "http://127.0.0.1:8000/api";

export class API {
  static async _fetch(url, accessToken) {
    return await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static async _post(url, accessToken, body) {
    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
  }

  static async _update(url, accessToken, body) {
    return await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    });
  }

  static async _delete(url, accessToken) {
    return await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  static async login({
    navigate,
    username,
    password,
    setAccessToken,
    setInvalidCredentialsError,
  }) {
    try {
      const res = await fetch(`${apiUrl}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const jsonRes = await res.json();
        const { access, refresh } = jsonRes;

        localStorage.setItem("username", JSON.stringify(username));
        localStorage.setItem("refreshaccessToken", JSON.stringify(refresh));
        localStorage.setItem("accessToken", JSON.stringify(access));

        setAccessToken(access);
        navigate("/");
      } else {
        setInvalidCredentialsError(true);
        const jsonRes = await res.json();
        throw new Error("Login failed: " + jsonRes.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async signup({
    navigate,
    username,
    setUsername,
    password,
    setPassword,
    setPasswordConfirmation,
    setUsernameTakenError,
    setUserRegisteredSuccessfully,
  }) {
    try {
      const res = await fetch(`${apiUrl}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setUsernameTakenError(false);
        const jsonRes = await res.json();
        setUserRegisteredSuccessfully(true);

        setUsername("");
        setPassword("");
        setPasswordConfirmation("");

        setTimeout(() => {
          navigate("/accounts/login");
        }, 1000);
      } else {
        setUsernameTakenError(true);
        const jsonRes = await res.json();
        throw new Error("Signup failed: " + jsonRes.error);
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async logout({ navigate, setUserLoggedIn, setAccessToken }) {
    try {
      const res = await fetch(`${apiUrl}/logout/`, {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 205) {
        // Logout successful
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("username");
        localStorage.clear();
        console.log("localStorage cleared!");

        setUserLoggedIn(false);
        setAccessToken(false);
        navigate("/accounts/login");
      } else {
        // Logout failure
        console.error("Logout failed: ", res.status);
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchExpenses(accessToken, setExpenseFunc) {
    try {
      const res = await API._fetch(`${apiUrl}/expenses/`, accessToken);

      if (res.ok) {
        const jsonRes = await res.json();
        setExpenseFunc(jsonRes);
      } else {
        throw new Error("Fetching expenses failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchPaginatedExpenses({
    accessToken,
    paginationSuffix,
    setExpenses,
    setPreviousPageAvailable,
    setNextPageAvailable,
    numPages,
    setNumPages,
  }) {
    try {
      const url = `${apiUrl}/paginated-expenses/?page=${paginationSuffix}`;
      const res = await API._fetch(url, accessToken);

      if (res.ok) {
        const paginatedExpenses = await res.json();

        setExpenses(paginatedExpenses.results);

        setPreviousPageAvailable &&
          setPreviousPageAvailable(paginatedExpenses?.previous);
        setNextPageAvailable && setNextPageAvailable(paginatedExpenses?.next);

        !numPages &&
          setNumPages &&
          setNumPages(
            Math.ceil(
              paginatedExpenses.count / paginatedExpenses.results.length
            )
          );
      } else {
        throw new Error("Fetching expenses failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async createExpense(
    navigate,
    accessToken,
    body,
    setAmount,
    setCategory,
    setContent,
    setDate,
    setSource
  ) {
    try {
      const res = await API._post(
        `${apiUrl}/expenses/create/`,
        accessToken,
        body
      );

      if (res.status === 201) {
        setAmount(0);
        setCategory("");
        setContent("");
        setDate("");
        setSource("");
        navigate("/");
      } else {
        throw new Error("Creating expense failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async updateExpense(
    navigate,
    accessToken,
    id,
    body,
    setAmount,
    setCategory,
    setContent,
    setDate,
    setSource
  ) {
    try {
      const res = await API._update(
        `${apiUrl}/expenses/update/${id}/`,
        accessToken,
        body
      );

      if (res.status === 204) {
        setAmount(0);
        setCategory(0);
        setContent(0);
        setDate(0);
        setSource(0);
        navigate("/");
      } else {
        throw new Error("Updating expense failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async deleteExpense(navigate, accessToken, id) {
    try {
      const res = await API._delete(
        `${apiUrl}/expenses/delete/${id}/`,
        accessToken
      );

      if (res.status === 204) {
        navigate("/");
      } else {
        throw new Error("Deleting expense failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchBudget(accessToken, setBudgetFunc) {
    try {
      const res = await API._fetch(`${apiUrl}/budget/`, accessToken);

      if (res.ok) {
        const jsonRes = await res.json();
        setBudgetFunc(jsonRes);
      } else {
        throw new Error("Fetching expenses failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async createBudget(navigate, accessToken, body, setAmount) {
    try {
      const res = await API._post(
        `${apiUrl}/budget/create/`,
        accessToken,
        body
      );

      if (res.status === 201) {
        setAmount(0);
        navigate("/");
      } else {
        throw new Error("Creating budget failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async updateBudget(navigate, accessToken, id, body, setAmount) {
    try {
      const res = await API._update(
        `${apiUrl}/budget/update/${id}/`,
        accessToken,
        body
      );

      if (res.status === 200) {
        setAmount(0);
        navigate("/");
      } else {
        throw new Error("Updating budget failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async deleteBudget(navigate, accessToken, id) {
    try {
      const res = await API._delete(
        `${apiUrl}/budget/delete/${id}/`,
        accessToken
      );

      if (res.status === 204) {
        navigate("/");
      } else {
        throw new Error("Deleting budget failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchLineChartData(accessToken, setLineChartData) {
    try {
      const res = await API._fetch(`${apiUrl}/line-chart-data/`, accessToken);
      if (res.ok) {
        const expenseData = await res.json();
        setLineChartData(expenseData);
      } else {
        throw new Error("Fetching line chart data failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchExpensesByMonthData(accessToken, setExpensesByMonth) {
    try {
      const res = await API._fetch(
        `${apiUrl}/expenses-by-month-bar-chart-data/`,
        accessToken
      );
      if (res.ok) {
        const expensesByMonthData = await res.json();
        setExpensesByMonth(expensesByMonthData);
      } else {
        throw new Error("Fetching expenses by month bar chart data failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchExpensesByWeekData(accessToken, setExpensesByWeek) {
    try {
      const res = await API._fetch(
        `${apiUrl}/expenses-by-week-bar-chart-data/`,
        accessToken
      );
      if (res.ok) {
        const expensesByWeekData = await res.json();
        setExpensesByWeek(expensesByWeekData);
      } else {
        throw new Error("Fetching expenses by week bar chart data failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchTotalExpensesData(accessToken, setTotalExpenses) {
    try {
      const res = await API._fetch(
        `${apiUrl}/total-expenses-pie-chart-data/`,
        accessToken
      );
      if (res.ok) {
        const totalExpensesData = await res.json();
        setTotalExpenses(totalExpensesData);
      } else {
        throw new Error("Fetching total expenses pie chart data failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchMonthlyExpensesData(accessToken, setMonthlyExpenses) {
    try {
      const res = await API._fetch(
        `${apiUrl}/monthly-expenses-pie-chart-data/`,
        accessToken
      );
      if (res.ok) {
        const monthlyExpensesData = await res.json();
        setMonthlyExpenses(monthlyExpensesData);
      } else {
        throw new Error("Fetching monthly expenses pie chart data failed");
      }
    } catch (err) {
      console.error(err);
    }
  }

  static async fetchStatisticsData(accessToken, setStatisticsData) {
    try {
      const res = await API._fetch(
        `${apiUrl}/statistics-table-data/`,
        accessToken
      );
      if (res.ok) {
        const statisticsData = await res.json();
        setStatisticsData(statisticsData);
      } else {
        throw new Error("Fetching statistics data failed");
      }
    } catch (err) {
      console.error(err);
    }
  }
}
