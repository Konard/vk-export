# vk-export

## Prerequisites

- Node.js
- npm

## Installation

1. Clone this repository:

```bash
git clone https://github.com/Konard/vk-export
```

2. Go to the cloned project's folder:

```bash
cd vk-export
```

3. Install the dependencies:

```bash
npm ci
```

This installs all necessary modules, including `jsdom`, `commander`, `luxon` and `iconv`.

## VK Private Messages Parser

This command line tool parses exported VK private messages in HTML format and converts them to a JSON file.

### Usage

1. Navigate to the project folder if you haven't:

```bash
cd vk-export
```

2. Run the tool:

```bash
node private-messages-parser.js -s path_to_source.html [-t path_to_target.json]
```

Replace `path_to_source.html` and (optionally) `path_to_target.json` with the paths of your source HTML file and the target .json file. If you don't specify a target JSON file, the program will create one with the same name as your source file.

```
Note: The `-t` option for specifying target file is optional.
```

This runs the script and saves the parsed messages as a JSON file.