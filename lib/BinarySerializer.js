class BinarySerializer {
	constructor(options = {}) {
		this.bigEndian = !!options.bigEndian
		this.offset = options.offset || 0
		this.length = options.length || (options.buffer ? options.buffer.length : 0)
		this.chunkSize = options.chunkSize || 4096
		this.buffer = options.buffer || new Buffer.alloc(this.chunkSize)
	}

	write(str, encoding = 'ascii') {
		var sbuf = Buffer.from(str, encoding)
		this._ensureHeadroom(sbuf.length)
		this.offset += sbuf.copy(this.buffer, this.offset)
		this.length = Math.max(this.offset, this.length)
	}

	writeBytes(buffer, offset = 0, length) {
		if(typeof length === 'undefined') length = buffer.length
		this._ensureHeadroom(length)
		buffer.copy(this.buffer, this.offset, offset, offset+length)
		this.offset += length
		this.length = Math.max(this.offset, this.length)
	}

	writeDouble(value) {
		this._ensureHeadroom(8)
		if(this.bigEndian) {
			this.offset = this.buffer.writeDoubleBE(value, this.offset)
		} else {
			this.offset = this.buffer.writeDoubleLE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeFloat(value) {
		this._ensureHeadroom(4)
		if(this.bigEndian) {
			this.offset = this.buffer.writeFloatBE(value, this.offset)
		} else {
			this.offset = this.buffer.writeFloatLE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeBigInt64(value) {
		this._ensureHeadroom(8)
		if(this.bigEndian) {
			this.offset = this.buffer.writeBigInt64BE(value, this.offset)
		} else {
			this.offset = this.buffer.writeBigInt64LE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeInt32(value) {
		this._ensureHeadroom(4)
		if(this.bigEndian) {
			this.offset = this.buffer.writeInt32BE(value, this.offset)
		} else {
			this.offset = this.buffer.writeInt32LE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeInt16(value) {
		this._ensureHeadroom(2)
		if(this.bigEndian) {
			this.offset = this.buffer.writeInt16BE(value, this.offset)
		} else {
			this.offset = this.buffer.writeInt16LE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeInt8(value) {
		this._ensureHeadroom(1)
		this.offset = this.buffer.writeInt8(value, this.offset)
		this.length = Math.max(this.offset, this.length)
	}

	writeBigUInt64(value) {
		this._ensureHeadroom(8)
		if(this.bigEndian) {
			this.offset = this.buffer.writeBigUInt64BE(value, this.offset)
		} else {
			this.offset = this.buffer.writeBigUInt64LE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeUInt32(value) {
		this._ensureHeadroom(4)
		if(this.bigEndian) {
			this.offset = this.buffer.writeUInt32BE(value, this.offset)
		} else {
			this.offset = this.buffer.writeUInt32LE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeUInt16(value) {
		this._ensureHeadroom(2)
		if(this.bigEndian) {
			this.offset = this.buffer.writeUInt16BE(value, this.offset)
		} else {
			this.offset = this.buffer.writeUInt16LE(value, this.offset)
		}
		this.length = Math.max(this.offset, this.length)
	}

	writeUInt8(value) {
		this._ensureHeadroom(1)
		this.offset = this.buffer.writeUInt8(value, this.offset)
		this.length = Math.max(this.offset, this.length)
	}

	seek(offset) {
		if(offset>this.length) {
			offset = this.length
		} else if (offset<0) {
			offset = 0
		}
		this.offset = offset
	}

	releaseBuffer() {
		return this.buffer.subarray(0, this.length)
	}

	_reallocate(newsize) {
		if(newsize<=this.buffer.length) return
		this.buffer = Buffer.concat([this.buffer, Buffer.alloc(newsize-this.buffer.length)])
	}

	_ensureHeadroom(extralength) {
		if(this.offset+extralength>=this.buffer.length) {
			this._reallocate(Math.ceil((this.buffer.length+extralength)/this.chunkSize)*this.chunkSize)
		}
	}
}

module.exports = BinarySerializer