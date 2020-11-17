# docker_buildx

GitHub Action to build and publish images using [Docker Buildx](https://docs.docker.com/buildx/working-with-buildx/).

## Inputs
The accepted inputs are:

| Name          | Type      | Default   | Mandatory   |  Description                                                    |
|---------------|-----------|-----------|-------------|-----------------------------------------------------------------|
| `tag`         | String    | `latest`  | No          | Tags (*comma separated*) to apply to the image                  |
| `imageName`   | String    |   | Yes         | Name of the image                                               |
| `dockerFile`  | String    | `Dockerfile` | No       | Name of the Dockerfile |
| `buildArg`    | String    |        | No       | Build arguments (*comma separated*) used to build the image |
| `publish`     | Boolean   | `false`   | No          | Indicate if the builded image should be published on Docker HUB |
| `platform`    | String    | `linux/amd64,linux/arm64,linux/arm/v7`  | No         | Platforms (*comma separated*) that should be used to build the image |                 |
| `dockerUser`   | String    | (value of `dockerHubUser`)  | Only if `publish` is true        | User that will publish the image                 |
| `dockerHubUser`   | String    |   | Only if `publish` is true         | User that will publish the image                 |
| `dockerPassword`   | String    | (value of `dockerHubUser`)  | Only if `publish` is true         | Password of the `dockerHubUser`                 |
| `dockerHubPassword`   | String    |   | Only if `publish` is true         | Password of the `dockerHubUser`                 |
| `dockerServer`   | String    |   |          | Registry, empty uses dockerHub |
| `load`     | Boolean   | `false`   | No          | Indicate if you want to load image into docker |
| `target`     | String   |    | No          | Set the target build stage to build |
| `context`     | String   |  `.`  | No          | Set the context path |
## Example of usage

```
jobs:
    build:
        runs-on: ubuntu-latest
        name: Build image job
        steps:
            - name: Checkout master
              uses: actions/checkout@master
            - name: Build and publish image
              uses: ilteoood/docker_buildx@master
              with:
                publish: true
                imageName: YOUR_IMAGE_NAME_HERE
                dockerUser: YOUR_USER_HERE
                dockerPassword: YOUR_PASSWORD_HERE
```
