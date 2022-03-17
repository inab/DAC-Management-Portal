# DAC Management Portal

## Summary

The DAC Management Portal, is the component of the iPC Data Access Framework where the creation of new Data Access Committees takes place. System administrators can inspect the data submissions and the different users roles and associated DACs.

### <ins>Services</ins>

#### Keycloak:

Keycloak controls authentication and authorization through all the platform components.

#### Nextcloud:

Data storage system for data submissions in the iPC Platform.

#### Postgres:

The Keycloak service DB.

#### MariaDB:

The Nextcloud service DB for metadata.

### <ins>Volumes</ins>

DAC Management Portal source code is mounted in their respective container, which facilitates the development process.

### <ins>Networks</ins>

The docker-compose.yml creates a private subnetwork (172.21.0.0/24) that assigns static IPs for the different services (ipam).

## How to deploy?

- Initialise git submodules (ipc-test-data and ipc-plugins) 

    Execute the following commands in the root folder:

    ```
    git submodule init
    git submodule update
    ```

    As a result, the different git repositories will be cloned as dependencies of the main project.

- Select a valid dataset for working on this environment:

    Execute the following commands in the root folder:

    ```
    cd ipc-test-data
    git checkout data-access-playground
    ```

    Give access to the Nextcloud folder:

    ```
    sudo chown -R www-data:docker nextcloud
    cd ..
    ```

- Launch the stack (main project root folder):

    ```
    docker-compose up
    ```

- Access to the DAC-Management-Portal service and login:

    - Go to your browser and access to http://172.21.0.1:4000

    - Once redirected to the Keycloak's login page, introduce your credentials (check the 'users.txt' file in the root project's folder)
