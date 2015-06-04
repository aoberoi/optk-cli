# optk

A command line interface developer tool for creating OpenTok sessions and tokens.

## Installation

`npm install optk -g`

## Usage

You can run `optk -h` to see a list of commands and their options.

## Storing a key and secret

There are 3 ways to specify a key and secret when a command. They are listed in order of priority:
*  command line parameters (`-k`, `--key`, `-s`, `--secret`)
*  environment variables (`OPTK_KEY`, `OPTK_SECRET`)
*  local `.optk` file (see below)

### Priority

You can use any combination of the above, but note the priority of which values are read. For
example:

`$ OPTK_KEY=12345 OPTK_SECRET=abcdef optk session --key 67890`

In the command above, the key specified as a command line parameter will override the key specified
in the environment variable.

### Using a local .optk file

You can create a file named `.optk` in your home directory (Mac OS X or Linux: ``~/.optk`, Windows:
`$USERPROFILE/.optk`) to specify your key and secret.

The format of the file is the following:

```
key=KEYVALUE
secret=SECRETVALUE
```
