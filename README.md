# Northcoders News API

## Background

In order to run this project locally, 2 '.env.' files will need to be added.
The first file with the name '.env.test' should contain 'PGDATABASE=test_database_name_here'. Similarly, the second file, '.env.development' should contain 'PGDATABASE=dev_database_name_here'. 
The databases will be created through running the setup.sql file.
The connection.js file will throw an error if they have not been set.