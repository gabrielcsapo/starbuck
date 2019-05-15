# 0.4.1 (05/14/2019)

- updates gitlab to use version 4 (@edvinbasil)
- fixes import statement to use the correct casing (effects unix systems)

# 0.4.0 (05/14/2019)

- moves from npm to pacote
- bumps dependencies

# 0.3.1 (11/27/2018)

- fix linting errors

# 0.3.0 (11/26/2018)

- adds user-prompt component to show users how to get to their page
- remove unnecessary package
- uses `woof` to parse argv
- updates `webpack@3` -> `webpack@4`

# 0.2.1 (12/12/2017)

- ensures process.env.PORT will effect the app on startup

# 0.2.0 (12/12/2017)

- don't cache anything that isn't a statusCode 200
- removes commander
- ./index or starbuck now responds with a promise when executed
- adds option to pass in a specific port `-p, --port [port]`
- updates dependencies
- when package is not found, throw up a page that actually highlights that, instead of the generic error page
- updates main page to show example of how to use the service

# 0.1.5 (10/23/2017)

- uses badgeit to create and serve badges instead of static assets
- properly handles errors from the UI
- caches at the routing level, much more reliable
- gets npm url from config file, can be overridden from override file or environment variable

# 0.1.4 (10/23/2017)

- updates ui framework

# 0.1.3 (10/21/2017)

- Overall site is using the correct `viewport` config which allows it to intelligently scale on devices
- DependenciesTable empty value now shows `No ${name} Found` instead of `No Entries Found`
- Dependencies page now has a better design on mobile and is more responsive.  

# 0.1.2 (10/19/2017)

- fixes overriding args, can be done like `github__token=hello npm start`

# 0.1.1 (10/19/2017)

- removes reference of original idea for name (helo)

# 0.1.0 (10/16/2017)

- updates dependencies
- fixes case sensitive bug in `src/router.js`
- add page to show all users repos `/:service/:owner`
- cleans up router logic
- adds the ability to select the table using hashes (github/gabrielcsapo/compress-object/peerDependencies)
- properly handles errors on the server and client side
- make github and gitlab endpoints configurable (be able to add authorization credentials)

# 0.0.0 (10/09/2017)

- adds storybook and basic doc page
- works with github and gitlab for basic use cases
- can serve badges for all dependency types
