# network-serializer

[![Build Status](https://travis-ci.org/tomdionysus/network-serializer.svg?branch=master)](https://travis-ci.org/tomdionysus/network-serializer)
[![Coverage Status](https://coveralls.io/repos/github/tomdionysus/network-serializer/badge.svg?branch=master)](https://coveralls.io/github/tomdionysus/network-serializer?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A byte-level serialiser package for NodeJS.

## Installation

```bash
npm install network-serializer
```

## Usage

```js
const { BinarySerializer, BinaryDeserializer } = require('network-serializer')

var ser = new BinarySerializer({ bigEndian: true })

ser.writeUInt32(0x2134)
ser.write('Hēllo Wōrld!', 'utf8')

var buf = ser.releaseBuffer()

var des = new BinaryDeserializer({ buffer: buf })

console.log("Int32", des.readUInt32())
console.log("String", des.read(14, 'utf8').toString())
```

## Roadmap

* JSDoc for All The Things™
