# Contributing

This project adheres to the [Open Code of Conduct][code-of-conduct]. By participating, you are expected to honor this code.
[code-of-conduct]: http://todogroup.org/opencodeofconduct/#flipstewart/flipstewart@me.com

If you are having an issue, [search open issues](https://github.com/flipstewart/gifhorse/issues) or create an issue and and we'll help point you in the right direction.

## Submitting a Pull Request

0. Fork it.
0. Create a branch (`git checkout -b this-is-my-shit`)
0. Commit your changes (`git commit -am "did the thing"`)
0. Push to the branch (`git push origin this-is-my-shit`)
0. Open a [Pull Request](http://github.com/flipstewart/gifhorse/pulls)
0. Enjoy a refreshing Lone Star and wait

![waitin' on that pr](CONTRIBUTING.jpg)

## Linting

To run the tests:

```
$ npm run lint
```

If nothing complains, congratulations!

## Releasing a new version

If you are the current maintainer of this package:

0. Bump the version number in `package.json`, adhering to [Semantic Versioning](http://semver.org/)
0. Push the new package release with `npm publish`.
