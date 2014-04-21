# grunt-deployinator [![Build Status](https://travis-ci.org/istvan-antal/grunt-deployinator.png?branch=master)](https://travis-ci.org/istvan-antal/grunt-deployinator)

> Grunt plugin that deploys git repositories on remote servers.

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-deployinator --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-deployinator');
```

## The "deployinator" task

### Overview
In your project's Gruntfile, add a section named `deployinator` to the data object passed into `grunt.initConfig()`.

Pull to deploy configuration:

```js
grunt.initConfig({
    deployinator: {
        app: {
            options: {
                host: "yourhost",
                directory: "/opt/location-of-your-repository"
            }
        }
    }
});
```

### Options

#### options.host

The ssh host of the production system.

#### options.directory

Location of the production source location on the production system.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

 * 0.1.0 initial version that is capabil of performing the deployment
