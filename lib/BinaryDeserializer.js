class BinaryDeserializer {
	constructor(options = {}) {
		this.bigEndian = !!options.bigEndian
		this.offset = options.offset || 0
		this.buffer = options.buffer
		this.parent = options.parent
	}

	read(length, encoding = 'ascii') {
		var out = this.buffer.slice(this.offset, this.offset+length)
		this.offset += length
		return out.toString(encoding)
	}

	readBytes(length) {
		var out = Buffer.from(this.buffer.slice(this.offset, this.offset+length))
		this.offset += length
		return out
	}

	readDouble() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readDoubleBE(this.offset)
		} else {
			out = this.buffer.readDoubleLE(this.offset)
		}
		this.offset += 8
		return out
	}

	readFloat() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readFloatBE(this.offset)
		} else {
			out = this.buffer.readFloatLE(this.offset)
		}
		this.offset += 4
		return out
	}

	readBigInt64() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readBigInt64BE(this.offset)
		} else {
			out = this.buffer.readBigInt64LE(this.offset)
		}
		this.offset += 8
		return out
	}

	readInt32() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readInt32BE(this.offset)
		} else {
			out = this.buffer.readInt32LE(this.offset)
		}
		this.offset += 4
		return out
	}

	readInt16() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readInt16BE(this.offset)
		} else {
			out = this.buffer.readInt16LE(this.offset)
		}
		this.offset += 2
		return out
	}

	readInt8() {
		var out = this.buffer.readInt8(this.offset)
		this.offset += 1
		return out
	}

	readBigUInt64() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readBigUInt64BE(this.offset)
		} else {
			out = this.buffer.readBigUInt64LE(this.offset)
		}
		this.offset += 8
		return out
	}

	readUInt32() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readUInt32BE(this.offset)
		} else {
			out = this.buffer.readUInt32LE(this.offset)
		}
		this.offset += 4
		return out
	}

	readUInt16() {
		var out
		if(this.bigEndian) {
			out = this.buffer.readUInt16BE(this.offset)
		} else {
			out = this.buffer.readUInt16LE(this.offset)
		}
		this.offset += 2
		return out
	}

	readUInt8() {
		var out = this.buffer.readUInt8(this.offset)
		this.offset += 1
		return out
	}

	seek(offset) {
		if(offset>this.length) {
			offset = this.length
		} else if (offset<0) {
			offset = 0
		}
		this.offset = offset
	}

	getAbsoluteOffset() {
		var o = this.offset, p = this.parent
		while(p) {
			o += p.offset
			p = p.parent
		}
		return o
	}
}

module.exports = BinaryDeserializer