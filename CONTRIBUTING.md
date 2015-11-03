Contributing
============

Thanks for your interest in [Common Form](http://commonform.github.io/)! All of the source code behind Common Form is written in [JavaScript](http://en.wikipedia.org/wiki/JavaScript), managed with [Git](http://git-scm.com), licensed under [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0), developed [on GitHub](https://github.com/commonform), and distributed via [npm](https://npmjs.com). Please have a look around and feel free to ask questions. Contributions of all kinds are welcome.

If you would like to contribute code, please [fork the GitHub repository](https://guides.github.com/activities/forking/) listed in [package.json](./package.json) within the package, also available via `npm show $PACKAGE_NAME repository.url`, then [start a new branch off `master`](https://guides.github.com/introduction/flow/). Something like `git checkout -b $YOUR_BRANCH master` should do the trick.

You're also welcome to [open an issue on GitHub](https://guides.github.com/features/issues/) to discuss the flaw you'd like to fix or the functionality you'd like to add. If you see a branch on GitHub other than `master` with recent commits, you may want to check whether the package is being rewritten before you dive in.

The easiest way to propose your changes is to open a pull request on GitHub. At least your final commit, but ideally all of your commits, should pass all pre-commit checks, which you can run with `npm run pre-commit`. [Travis CI](https://travis-ci.org/) runs the same checks for code on GitHub with [a number of node.js and io.js releases](./.travis.yml).
