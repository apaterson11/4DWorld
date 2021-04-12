# 4DWorld

4DWorld was created by CS23 as part of the University of Glasgow's Team Project and Professional Software Development modules.

## Current Features
- core marker functionality (add, delete, edit, change layer, upload image, change icon type)
- core layer functionality (add, delete, edit, change polyline type, change colour)
- view/edit modes for each project
- edit mode that can be accessed from a generated link by any user (authenticated or not)
- allow user to create, delete and edit groups 
- allow user to have several projects that correspond to one group
- allow user to edit profile details

## Installation and Setup

On the backend folder(cs23-main/backend) please use the package manager [pip](https://pip.pypa.io/en/stable/) to install 

```bash
pip install requirements.txt
python manage.py makemigrations
python manage.py migrate 
python manage.py fetch_countries
python manage.py populate_map_styles
python manage.py runserver
```
On the Frontend please be in the psd-prototype directory (cs23-main/frontend/psd-prototype)
```bash
npm install
npm start
```
If npm install does not work, you can use;
```bash
yarn install
npm start
```
## Populating Users from CSV file

If you wish to populate the database with users of your own, you can do this through your choice of terminal. 
First, simply drop any CSV files you want imported into the backend folder (cs23-main/backend). Then, run the following command:
``` bash
python populate.py
```
Then, as long as you adhere to the template provided exactly, the database will be populated with your users.

## Running tests

To test the build, simply navigate to the backend folder (cs23-main/backend) and run the following command:
``` bash
python manage.py test
```

## License
[Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
