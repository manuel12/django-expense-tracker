"""
WSGI config for expense_tracker project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/howto/deployment/wsgi/
"""

import os
import dotenv

from django.core.wsgi import get_wsgi_application

# Load .env variables
dotenv.load_dotenv(
  os.path.join(os.path.dirname(__file__), '.env')
)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'expense_tracker.settings')

if os.getenv('DJANGO_SETTINGS_MODULE'):
  os.environ['DJANGO_SETTINGS_MODULE'] = os.getenv('DJANGO_SETTINGS_MODULE')

application = get_wsgi_application()
