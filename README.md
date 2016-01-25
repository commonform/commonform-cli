Compose, verify, and share form contracts at the command line.

# Installation

At the command line, with [npm](https://npmjs.com) installed:

```bash
npm --global install commonform-cli
commonform --help
```

`commonform-cli` is tested on the current Stable and Long Term Support (LTS) versions of [Node.js](https://nodejs.org). Please see the [Travis CI configuration file](./.travis.yml).

# Examples

You may like to download a few sample form documents to start:

```shellsession
$ git clone https://github.com/commonform/commonform-samples samples
$ cd samples
```

To format a form, say the Orrick Mutual NDA, for reading in the terminal:

```shellsession
$ commonform render Orrick-Mutual-NDA.commonform
```

To convert to OfficeOpenXML (.docx) for Microsoft Word:

```shellsession
$ commonform render --format docx Orrick-Mutual-NDA.commonform
```

And with a title:

```shellsession
$ commonform render --title "Mutual Nondisclosure Agrement" --format docx Orrick-Mutual-NDA.commonform
```

To check a form for technical errors:

```shellsession
$ commonform lint SAFE-MFN.commonform
```

To view automated style critiques:

```shellsession
$ commonform critique IBM-Cloud-Services-Agreement.commonform
```

To hash a form:

```shellsession
$ commonform hash Contract-Standards-TOS.commonform
```

To see a list of additional subcommands and their options:

```shellsession
$ commonform --usage
```

# Related Projects

For [Vim](https://github.com/commonform/vim-commonform) users there is also [vim-commonform](https://github.com/commonform/vim-commonform) with syntax highlighting and conveniences for Common Form markup.
