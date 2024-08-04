# Hardware Store Analytics Platform
***
This repository contains the code for an analytics platform developed for a hardware store using Django. The platform features comprehensive data visualization tools for sales, user behavior, and sentiment analysis.

***
## Project Description
**_NOTE:_** This project is an analytics platform designed for a hardware store. It allows store managers to visualize sales data, track user behavior, and perform sentiment analysis on customer feedback. The backend, built with Django, handles data collection, processing, and analysis.

### Features
* Data Visualization: Interactive charts and graphs to visualize sales data and user behavior.
* Sentiment Analysis: Automated sentiment analysis on customer feedback to gauge customer satisfaction.
* User Roles: Role-based access control to manage user permissions and data access.
* Revenue Tracking: Detailed reports on product revenue and sales performance.

#### Prerequisites
* Node.js
* Python 3.x
* Django
* PostgreSQL


### Clone the repository
```
git clone (https://github.com/Savoyevatel/website_charts)
```
#### Frontend Setup

Navigate to the frontend directory

```
cd backend/frontend
```

Install the required packages
```
npm install
```

Start the React development server
```
npm start
```

#### Backend Setup

Navigate to the backend directory

```
cd backend
```

### Create a virtual environment

```
python3 -m venv venv
source venv/bin/activate
```

### Install the required packages
```
pip install -r requirements.txt
```

### Apply migrations and start the Django development server
```
python manage.py migrate
python manage.py runserver
```

### Data Visualization and Analysis

The platform uses Django for data processing and visualization. The data visualization tools include charts and graphs for tracking sales and user behavior.


### Running the Project
To run the project, ensure both the frontend and backend servers are running simultaneously. The React frontend will interact with the Django backend to process user requests and orders.
```
# In one terminal window, start the React frontend
cd frontend
npm start

# In another terminal window, start the Django backend
cd backend
source venv/bin/activate
python manage.py runserver
```

## References

[Django documentation](https://docs.djangoproject.com/en/3.2/)

[React documentation](https://react.dev/)

[NLTK documentation](https://www.nltk.org/)
